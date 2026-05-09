import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth.js';
import { listingsRoutes } from './routes/listings.js';
import './jobs/matching.js'; // Start the BullMQ worker

const app = Fastify({ 
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  } 
});

// Plugins
await app.register(helmet);
await app.register(cors, { origin: true });
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
await app.register(jwt, { 
  secret: process.env.JWT_SECRET || 'dev_secret' 
});

// Authentication Middleware
app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorised' });
  }
});

// Routes
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(listingsRoutes, { prefix: '/api/listings' });

// Health Check
app.get('/health', async () => {
  return { status: 'ok', service: 'api-gateway' };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`API Gateway running at http://0.0.0.0:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
