import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('auth.register')
  register(data: { name: string; email: string; password: string }) {
    return this.authService.register(data);
  }

  @MessagePattern('auth.login')
  login(data: { email: string; password: string }) {
    return this.authService.login(data.email, data.password);
  }

  @MessagePattern('auth.refresh')
  refresh(data: { refreshToken: string }) {
    return this.authService.refreshTokens(data.refreshToken);
  }
}
