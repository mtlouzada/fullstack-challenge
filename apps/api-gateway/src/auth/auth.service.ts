import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  login(data: any) {
    return this.authClient.send('auth.login', data);
  }

  register(data: any) {
    return this.authClient.send('auth.register', data);
  }

  refresh(refreshToken: string) {
    return this.authClient.send('auth.refresh', { refreshToken });
  }

}
