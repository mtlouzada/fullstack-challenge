import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guards';

import { RmqModule } from '../RMQ/rmq.module';

@Module({
  imports: [
    RmqModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [
    AuthService,
    JwtAuthGuard,
    RmqModule,
  ],
})
export class AuthModule {}
