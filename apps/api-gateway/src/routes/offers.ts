import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import sql from '../db/index.js';
import { createNotification } from '../services/notifications.js';

export async function offersRoutes(app: FastifyInstance) {

  // ── POST /api/offers  (buyer submits an offer on a listing) ─────────────────
  app.post('/', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const schema = z.object({
      listing_id: z.string().uuid(),
      quantity_kg: z.number().positive(),
      max_price: z.number().positive(),
    });

    const body = schema.parse(request.body);
    const buyer = (request as any).user;

    // Look up the listing to get the farmer id
    const [listing] = await sql`
      SELECT id, farmer_id, crop_type, status FROM listings WHERE id = ${body.listing_id}
    `;

    if (!listing) {
      return reply.code(404).send({ error: 'Listing not found' });
    }
    if (listing.status !== 'active' && listing.status !== 'matched') {
      return reply.code(409).send({ error: 'Listing is no longer active or available' });
    }

    const [offer] = await sql`
      INSERT INTO matches (
        listing_id, buyer_id, farmer_id,
        proposed_price, quantity_kg, status
      ) VALUES (
        ${body.listing_id}, ${buyer.id}, ${listing.farmer_id},
        ${body.max_price}, ${body.quantity_kg}, 'pending'
      ) RETURNING *
    `;

    return reply.code(201).send(offer);
  });

  // ── GET /api/offers/incoming  (farmer sees all pending offers on their listings)
  app.get('/incoming', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const farmer = (request as any).user;

    const offers = await sql`
      SELECT
        m.id             AS offer_id,
        m.status,
        COALESCE(m.proposed_price, pr.max_price) AS proposed_price,
        m.created_at,
        m.updated_at,
        l.id             AS listing_id,
        l.crop_type,
        l.quantity_kg    AS listing_qty,
        l.asking_price,
        u.id             AS buyer_id,
        u.name           AS buyer_name,
        u.phone          AS buyer_phone
      FROM matches m
      JOIN listings l ON m.listing_id = l.id
      JOIN users    u ON m.buyer_id   = u.id
      LEFT JOIN purchase_requests pr ON m.purchase_request_id = pr.id
      WHERE m.farmer_id = ${farmer.id}
      ORDER BY m.created_at DESC
    `;

    return offers;
  });

  // ── GET /api/offers/my  (buyer sees status of their own offers) ─────────────
  app.get('/my', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const buyer = (request as any).user;

    const offers = await sql`
      SELECT
        m.id             AS offer_id,
        m.status,
        m.proposed_price,
        m.quantity_kg,
        m.created_at,
        m.updated_at,
        l.id             AS listing_id,
        l.crop_type,
        l.quantity_kg    AS listing_qty,
        l.asking_price,
        u.name           AS farmer_name
      FROM matches m
      JOIN listings l ON m.listing_id = l.id
      JOIN users    u ON m.farmer_id  = u.id
      WHERE m.buyer_id = ${buyer.id}
      ORDER BY m.created_at DESC
    `;

    return offers;
  });

  // ── PATCH /api/offers/:id  (farmer accepts or declines) ─────────────────────
  app.patch('/:id', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const { id } = request.params as any;
    const schema = z.object({
      status: z.enum(['accepted', 'declined']),
    });

    const { status } = schema.parse(request.body);
    const farmer = (request as any).user;

    // Verify this offer belongs to the authenticated farmer
    const [offer] = await sql`
      SELECT m.*, l.crop_type FROM matches m
      JOIN listings l ON m.listing_id = l.id
      WHERE m.id = ${id} AND m.farmer_id = ${farmer.id}
    `;

    if (!offer) {
      return reply.code(404).send({ error: 'Offer not found' });
    }
    if (offer.status !== 'pending') {
      return reply.code(409).send({ error: 'Offer already responded to' });
    }

    const [updated] = await sql`
      UPDATE matches
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // If accepted, mark the listing as matched
    if (status === 'accepted') {
      await sql`
        UPDATE listings SET status = 'matched', updated_at = NOW()
        WHERE id = ${offer.listing_id}
      `;
      // Decline all other pending offers for the same listing
      await sql`
        UPDATE matches SET status = 'declined', updated_at = NOW()
        WHERE listing_id = ${offer.listing_id}
          AND id != ${id}
          AND status = 'pending'
      `;
    }

    return updated;
  });

  // ── POST /api/offers/:id/pay  (buyer pays for an accepted offer) ───────────
  app.post('/:id/pay', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const { id } = request.params as any;
    const buyer = (request as any).user;
    const { method, amount, listing_id } = request.body as any;

    console.log(`Payment attempt for offer ${id} by buyer ${buyer.id}`);
    
    try {
      // Verify the offer is accepted and belongs to this buyer
      const [offer] = await sql`
        SELECT * FROM matches 
        WHERE id = ${id} AND buyer_id = ${buyer.id} AND status = 'accepted'
      `;

      if (!offer) {
        console.error(`Accepted offer ${id} not found for buyer ${buyer.id}`);
        return reply.code(404).send({ error: 'Accepted offer not found' });
      }

      // Reduce the quantity in the listing
      // Fallback to listing quantity if offer quantity is not set
      const [listing] = await sql`SELECT quantity_kg FROM listings WHERE id = ${listing_id}`;
      const purchasedQty = offer.quantity_kg || listing?.quantity_kg || 0;

      // Create a transaction
      const [transaction] = await sql`
        INSERT INTO transactions (
          match_id, listing_id, buyer_id, farmer_id, 
          quantity_kg, agreed_price, total_amount, 
          payment_status, payment_ref
        ) VALUES (
          ${id}, ${listing_id}, ${buyer.id}, ${offer.farmer_id},
          ${purchasedQty}, 
          ${offer.proposed_price}, ${amount},
          'escrow', ${'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase()}
        ) RETURNING *
      `;

      // Update match status to 'paid'
      await sql`
        UPDATE matches 
        SET status = 'paid', updated_at = NOW() 
        WHERE id = ${id}
      `;
      
      const [updatedListing] = await sql`
        UPDATE listings 
        SET 
          quantity_kg = GREATEST(0, quantity_kg - ${purchasedQty}),
          status = CASE 
            WHEN (quantity_kg - ${purchasedQty}) <= 0 THEN 'sold'::varchar
            ELSE status 
          END,
          updated_at = NOW()
        WHERE id = ${listing_id}
        RETURNING *
      `;

      // Notify the farmer
      await createNotification(
        offer.farmer_id,
        'Payment Received!',
        `Buyer ${buyer.name} has paid GHS ${amount.toLocaleString()} for ${purchasedQty}kg of your ${offer.crop_type}. Remaining: ${updatedListing.quantity_kg}kg.`,
        'payment',
        { offer_id: id, transaction_id: transaction.id, remaining_qty: updatedListing.quantity_kg }
      );

      return { 
        message: 'Payment successful', 
        transaction, 
        remaining_qty: updatedListing.quantity_kg,
        listing_status: updatedListing.status 
      };
    } catch (err: any) {
      console.error('Payment Error:', err);
      return reply.code(500).send({ error: 'Payment implementation error', details: err.message });
    }
  });
}
