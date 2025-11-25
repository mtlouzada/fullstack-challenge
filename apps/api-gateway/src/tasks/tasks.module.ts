import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { RmqModule } from '../RMQ/rmq.module';

@Module({
  imports: [RmqModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
