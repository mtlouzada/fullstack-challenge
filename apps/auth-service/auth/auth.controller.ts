import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { RegisterDto } from '../src/dto/register.dto';
import { LoginDto } from '../src/dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password);
    return user;
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw { status: 401, message: 'Invalid credentials' };
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      const payload: any = jwt.verify(body.refreshToken, process.env.JWT_REFRESH_SECRET);
      return this.authService.refreshTokens(payload.sub, body.refreshToken);
    } catch (err) {
      throw { status: 401, message: 'Invalid refresh token' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return { user: req.user };
  }
}
