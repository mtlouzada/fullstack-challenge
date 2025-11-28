import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TasksService } from './tasks.service';
import { TasksHttpController } from './tasks.controller';

import { Task } from '../entities/task.entity';
import { Comment } from '../entities/comment.entity';
import { TaskUser } from '../entities/task-user.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Comment, TaskUser, AuditLog]),

    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATIONS_HOST || 'notifications-service',
          port: Number(process.env.NOTIFICATIONS_PORT) || 3002,
        },
      },
    ]),
  ],

  controllers: [
    TasksHttpController,
  ],

  providers: [TasksService],
})
export class TasksModule {}
