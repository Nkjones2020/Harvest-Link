import sql from '../db/index.js';

export async function createNotification(userId: string, title: string, message: string, type: string = 'info', metadata: any = {}) {
  try {
    const [notification] = await sql`
      INSERT INTO notifications (user_id, title, message, type, metadata)
      VALUES (${userId}, ${title}, ${message}, ${type}, ${metadata})
      RETURNING *
    `;
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}
