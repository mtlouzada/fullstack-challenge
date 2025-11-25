import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token não encontrado.');
    }

    const token = authorization.replace('Bearer ', '');

    try {
      // chama o microserviço auth-service para validar o token
      const payload = await lastValueFrom(
        this.authClient.send('auth.validate', { token }),
      );

      if (!payload) {
        throw new UnauthorizedException('Token inválido.');
      }

      // injeta o usuário no request
      request.user = payload;
      return true;
    } catch (e) {
      console.error('Erro ao validar token:', e.message);
      throw new UnauthorizedException('Token inválido.');
    }
  }
}
