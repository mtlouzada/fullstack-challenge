import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../entities/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private jwt: JwtService,
  ) { }

  async register(data: { name: string; email: string; password: string }) {
    const existing = await this.users.findByEmail(data.email);
    if (existing) throw new UnauthorizedException('Email already used');

    const user = await this.users.create(data.name, data.email, data.password);

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
        secret: process.env.JWT_SECRET,
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

  async refreshTokens(refreshToken: string) {
    try {
      const payload: any = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.issueTokens(payload.sub);

    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  validateToken(token: string) {
    try {
      return this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      console.error('Token inválido:', err.message);
      return null;
    }
  }


}
