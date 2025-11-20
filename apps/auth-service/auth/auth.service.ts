import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly amqp: AmqpConnection
  ) {}

  async register(email: string, password: string) {
    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, password: hashed });
    await this.usersRepo.save(user);

    // publish event to RabbitMQ (user registered)
    this.amqp.publish(process.env.RABBITMQ_EXCHANGE || 'auth.exchange', 'auth.user_registered', {
      userId: user.id,
      email: user.email
    });

    return { id: user.id, email: user.email };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    const matched = await bcrypt.compare(pass, user.password);
    if (matched) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    user.currentHashedRefreshToken = hashedRefresh;
    await this.usersRepo.save(user);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || !user.currentHashedRefreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    if (!match) throw new UnauthorizedException();

    // issue new tokens
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' });
    const newRefreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });

    const hashedNewRefresh = await bcrypt.hash(newRefreshToken, 10);
    user.currentHashedRefreshToken = hashedNewRefresh;
    await this.usersRepo.save(user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return;
    user.currentHashedRefreshToken = null;
    await this.usersRepo.save(user);
  }
}
