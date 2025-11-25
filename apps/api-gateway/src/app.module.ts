import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { RmqModule } from './RMQ/rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RmqModule, 
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
