import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  login(data: any) {
    return this.authClient.send('auth_login', data);
  }

  register(data: any) {
    return this.authClient.send('auth_register', data);
  }

  refresh(refreshToken: string) {
    return this.authClient.send('auth_refresh', { refreshToken });
  }

  me(accessToken: string) {
    return this.authClient.send('auth_me', { accessToken });
  }
}
