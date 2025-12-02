import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

import { RmqModule } from '../RMQ/rmq.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,  // <-- necessário para rodar JwtAuthGuard
    RmqModule,   // <-- necessário para TASKS_SERVICE
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
