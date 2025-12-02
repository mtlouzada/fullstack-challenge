import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { RpcTasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

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
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672'],
          queue: 'notifications_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [RpcTasksController],
  providers: [TasksService],
})
export class TasksModule {}
