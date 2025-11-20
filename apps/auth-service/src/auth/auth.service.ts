import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../entities/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private jwt: JwtService,
  ) {}

  async register(data: { email: string; password: string }) {
    const existing = await this.users.findByEmail(data.email);
    if (existing) throw new UnauthorizedException('Email already used');

    const user = await this.users.create(data.email, data.password);

    return this.issueTokens(user.id);
  }

  async login(email: string, password: string) {
    const user = await this.users.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id);
  }

  async issueTokens(userId: string | number) {
    const sub = String(userId);

    const accessToken = await this.jwt.signAsync(
      { sub },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.issueTokens(userId);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
