import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      body: z.object({
        phone: z.string(),
        name: z.string(),
        role: z.enum(['farmer', 'buyer', 'cooperative', 'agent', 'admin']),
      })
    }
  }, async (request, reply) => {
    const { phone, name, role } = request.body as any;
    
    // In a real app, save to PostgreSQL
    // For now, we'll just return a success message
    return reply.code(201).send({ 
      message: 'User registered', 
      user: { phone, name, role } 
    });
  });

  app.post('/login', {
    schema: {
      body: z.object({
        phone: z.string()
      })
    }
  }, async (request, reply) => {
    const { phone } = request.body as any;
    
    // Simulate finding user and issuing token
    const token = app.jwt.sign({ id: 'user-id-123', phone, role: 'farmer' });
    
    return { 
      access_token: token,
      message: 'OTP sent to ' + phone 
    };
  });

  app.post('/verify-otp', async (request, reply) => {
    // Implement OTP verification logic
    return { success: true };
  });
}
