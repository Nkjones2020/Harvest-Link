import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgresql://hl_user:hl_secret@postgres:5432/harvestlink');

export default sql;
