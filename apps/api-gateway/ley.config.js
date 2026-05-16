import 'dotenv/config';
import { parse } from 'pg-connection-string';

const { host, port, database, user, password } = parse(process.env.DATABASE_URL || 'postgresql://hl_user:hl_secret@localhost:5433/harvestlink');

export default {
  driver: 'postgres',
  host,
  port: parseInt(port || '5432'),
  database,
  username: user,
  password,
  dir: 'migrations',
  require: ['dotenv/config']
};
