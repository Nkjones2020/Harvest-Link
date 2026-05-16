import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgresql://hl_user:hl_secret@localhost:5433/harvestlink');

export default sql;
