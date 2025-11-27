import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Comment } from './entities/comment.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TASKS_DB_HOST || 'localhost',
  port: Number(process.env.TASKS_DB_PORT) || 5432,
  username: process.env.TASKS_DB_USER || 'postgres',
  password: process.env.TASKS_DB_PASSWORD || 'postgres',
  database: process.env.TASKS_DB_NAME || 'app_db',
  entities: [Task, Comment],
  synchronize: true,
};
