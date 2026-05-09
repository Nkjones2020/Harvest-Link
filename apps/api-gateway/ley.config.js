import 'dotenv/config';
import { parse } from 'pg-connection-string';

const { host, port, database, user, password } = parse(process.env.DATABASE_URL || '');

export default {
  driver: 'postgres',
  host,
  port: parseInt(port || '5432'),
  database,
  username: user,
  password,
  dir: '../../db/migrations',
  require: ['dotenv/config']
};
