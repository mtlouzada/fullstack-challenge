import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Notification } from './src/entities/notification.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'notifications_db',
  entities: [Notification],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
});
