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
    if (!data || !data.refreshToken) {
      throw new Error('Invalid refresh payload');
    }

    return this.authService.refreshTokens(data.refreshToken);
  }

  @MessagePattern('auth.validate')
  validateToken(data: { token: string }) {
    try {
      const payload = this.authService.validateToken(data.token);
      return payload;
    } catch (err) {
      console.error('❌ Erro ao validar token:', err.message);
      return null;
    }
  }

}
