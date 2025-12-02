import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'postgres',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'app_db',

  entities: [
    join(__dirname, 'src/entities/*.{ts,js}'),
  ],

  migrations: [
    join(__dirname, 'src/migrations/*.{ts,js}'),
  ],

  synchronize: false,
  logging: true,
});
