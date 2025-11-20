import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @MessagePattern('auth.register')
  register(@Payload() data: RegisterDto) {
    return this.auth.register(data);
  }

  @MessagePattern('auth.login')
  login(@Payload() data: LoginDto) {
    return this.auth.login(data.email, data.password);
  }

  @MessagePattern('auth.refresh')
  refresh(@Payload() data: RefreshDto) {
    return this.auth.refreshTokens(data.userId, data.refreshToken);
  }
}
