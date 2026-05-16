import { Queue, Worker } from 'bullmq';
import sql from '../db/index.js';

const connection = { 
  host: process.env.REDIS_HOST || 'redis', 
  port: parseInt(process.env.REDIS_PORT || '6379') 
};

export const matchingQueue = new Queue('matching', { connection });

export const matchingWorker = new Worker('matching', async (job) => {
  const { listingId, cropType, latitude, longitude, quantityKg } = job.data;
  
  console.log(`[Matching] Processing listing ${listingId} (${cropType})...`);

  // 1. Fetch listing details to check spoilage risk
  const [listing] = await sql`SELECT * FROM listings WHERE id = ${listingId}`;
  if (!listing) return;

  // 2. Advanced Match: Proximity + Spoilage Urgency
  // If spoilage_days is low (< 3), we expand search radius and prioritize high-volume buyers
  const searchRadius = listing.spoilage_days < 3 ? 100000 : 50000; // 100km vs 50km

  const matches = await sql`
    SELECT 
      pr.id as request_id,
      pr.buyer_id,
      pr.quantity_kg as requested_qty,
      u.name as buyer_name,
      ST_DistanceSphere(
        ST_MakePoint(${longitude}, ${latitude}),
        pr.location
      ) / 1000 as distance_km
    FROM purchase_requests pr
    JOIN users u ON pr.buyer_id = u.id
    WHERE pr.crop_type = ${cropType}
      AND pr.status = 'active'
      AND ST_DistanceSphere(
        ST_MakePoint(${longitude}, ${latitude}),
        pr.location
      ) <= ${searchRadius}
    ORDER BY 
      CASE WHEN ${listing.spoilage_risk} = 'red' THEN 0 ELSE 1 END,
      distance_km ASC
  `;

  if (matches.length > 0) {
    for (const match of matches) {
      // Calculate a matching score (0.0 to 1.0)
      let score = 1.0 - (match.distance_km / (searchRadius / 1000));
      if (listing.spoilage_risk === 'red') score += 0.2; // Spoilage premium for urgency

      await sql`
        INSERT INTO matches (
          listing_id, purchase_request_id, buyer_id, farmer_id, 
          match_score, status, distance_km
        )
        VALUES (
          ${listingId}, ${match.request_id}, ${match.buyer_id}, ${listing.farmer_id}, 
          ${Math.min(score, 1.0)}, 'pending', ${match.distance_km}
        )
        ON CONFLICT ON CONSTRAINT unique_listing_request DO UPDATE
        SET match_score = EXCLUDED.match_score, updated_at = NOW()
      `;
      
      console.log(`[Match Found] ${listing.crop_type} -> ${match.buyer_name} (${match.distance_km.toFixed(1)}km, Score: ${score.toFixed(2)})`);
    }
  }
}, { connection });
