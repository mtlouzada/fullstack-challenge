import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

declare const process: { env: { [key: string]: string | undefined } };

@Module({
  imports: [
    AuthModule,

  ],
})
export class AppModule {}
