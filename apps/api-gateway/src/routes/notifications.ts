import { FastifyInstance } from 'fastify';
import sql from '../db/index.js';

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const user = (request as any).user;
    
    const notifications = await sql`
      SELECT * FROM notifications 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 50
    `;
    
    return notifications;
  });

  app.patch('/:id/read', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const { id } = request.params as any;
    const user = (request as any).user;

    await sql`
      UPDATE notifications SET is_read = TRUE 
      WHERE id = ${id} AND user_id = ${user.id}
    `;

    return { success: true };
  });

  app.delete('/', {
    preHandler: [app.authenticate as any],
  }, async (request, reply) => {
    const user = (request as any).user;
    await sql`DELETE FROM notifications WHERE user_id = ${user.id}`;
    return { success: true };
  });
}
