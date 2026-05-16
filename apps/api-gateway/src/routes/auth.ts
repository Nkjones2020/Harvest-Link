import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import sql from '../db/index.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const bodySchema = z.object({
      phone: z.string(),
      name: z.string(),
      role: z.enum(['farmer', 'buyer', 'cooperative', 'agent', 'admin']),
    });
    
    const { phone, name, role } = bodySchema.parse(request.body);
    
    try {
      // Check if user exists
      const [existing] = await sql`SELECT * FROM users WHERE phone = ${phone}`;
      
      if (existing) {
        // If user exists, add the new role to their roles array if not already there
        const roles = existing.roles || [existing.role];
        if (!roles.includes(role)) {
          roles.push(role);
          await sql`UPDATE users SET roles = ${roles} WHERE id = ${existing.id}`;
        }
        
        const token = app.jwt.sign({ id: existing.id, phone: existing.phone, roles });
        return reply.code(200).send({ 
          message: 'Role added to existing user', 
          user: { ...existing, roles },
          access_token: token
        });
      }

      // Insert new user
      const [user] = await sql`
        INSERT INTO users (phone, name, role, roles)
        VALUES (${phone}, ${name}, ${role}, ARRAY[${role}])
        RETURNING id, phone, name, role, roles
      `;

      const token = app.jwt.sign({ id: user.id, phone: user.phone, roles: user.roles });

      return reply.code(201).send({ 
        message: 'User registered successfully', 
        user,
        access_token: token
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Database error during registration' });
    }
  });

  app.post('/login', async (request, reply) => {
    const bodySchema = z.object({
      phone: z.string()
    });
    const { phone } = bodySchema.parse(request.body);
    
    try {
      const [user] = await sql`SELECT id, phone, name, role, roles FROM users WHERE phone = ${phone}`;
      
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Ensure roles array exists
      const roles = user.roles || [user.role];
      const token = app.jwt.sign({ id: user.id, phone: user.phone, roles });
      
      return { 
        access_token: token,
        user: { ...user, roles },
        message: 'Login successful' 
      };
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Database error during login' });
    }
  });

  app.post('/verify-otp', async (request, reply) => {
    return { success: true };
  });
}
