import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { matchingQueue } from '../jobs/matching.js';
import sql from '../db/index.js';

export async function listingsRoutes(app: FastifyInstance) {
  // GET all listings for the logged-in farmer
  app.get('/', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const user = (request as any).user;
    
    const listings = await sql`
      SELECT * FROM listings 
      WHERE farmer_id = ${user.id}
      ORDER BY created_at DESC
    `;
    
    return listings;
  });

  // GET all listings (for Marketplace/Buyers)
  app.get('/all', async (request, reply) => {
    const listings = await sql`
      SELECT l.*, u.name as farmer_name 
      FROM listings l
      JOIN users u ON l.farmer_id = u.id
      ORDER BY created_at DESC
    `;
    return listings;
  });

  app.post('/', {
    preHandler: [app.authenticate as any],
    schema: {
      body: z.object({
        cropType: z.string(),
        quantityKg: z.number().positive(),
        harvestDate: z.string(),
        storageMethod: z.enum(['open_air', 'grain_bag', 'cold_store', 'silo', 'other']),
        latitude: z.number(),
        longitude: z.number(),
        askingPrice: z.number().optional(),
      })
    }
  }, async (request, reply) => {
    const body = request.body as any;
    const user = (request as any).user;

    try {
      // 1. Call Spoilage Engine
      const spoilageUrl = process.env.SPOILAGE_ENGINE_URL || 'http://hl_spoilage:8080';
      const spoilageRes = await fetch(`${spoilageUrl}/api/spoilage/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: body.cropType,
          harvestDate: body.harvestDate,
          storageMethod: body.storageMethod,
          latitude: body.latitude,
          longitude: body.longitude,
        })
      });

      let spoilage = { spoilageDays: 5, spoilageRisk: 'green', spoilageScore: 0 };
      if (spoilageRes.ok) {
        spoilage = await spoilageRes.json();
      } else {
        app.log.warn('Spoilage engine unavailable, using defaults');
      }

      // 2. Save listing to PostgreSQL
      const [listing] = await sql`
        INSERT INTO listings (
          farmer_id, crop_type, quantity_kg, harvest_date, 
          storage_method, latitude, longitude, asking_price,
          spoilage_days, spoilage_risk, spoilage_score
        ) VALUES (
          ${user.id}, ${body.cropType}, ${body.quantityKg}, ${body.harvestDate},
          ${body.storageMethod}, ${body.latitude}, ${body.longitude}, ${body.askingPrice || 0},
          ${spoilage.spoilageDays}, ${spoilage.spoilageRisk}, ${spoilage.spoilageScore}
        ) RETURNING *
      `;

      // 3. Queue matching job
      await matchingQueue.add('find-matches', {
        listingId: listing.id,
        cropType: body.cropType,
        latitude: body.latitude,
        longitude: body.longitude,
        quantityKg: body.quantityKg
      });

      return reply.code(201).send(listing);
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  app.get('/:id/matches', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const { id } = request.params as any;
    
    const matches = await sql`
      SELECT 
        m.id as match_id,
        m.status as match_status,
        pr.quantity_kg,
        pr.max_price,
        u.name as buyer_name,
        u.phone as buyer_phone
      FROM matches m
      JOIN purchase_requests pr ON m.request_id = pr.id
      JOIN users u ON pr.buyer_id = u.id
      WHERE m.listing_id = ${id}
    `;
    
    return matches;
  });
}
