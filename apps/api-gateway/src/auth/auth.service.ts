import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  private async send(pattern: string, data: any) {
    await this.authClient.connect();
    const obs = this.authClient.send(pattern, data);
    return firstValueFrom(obs.pipe(timeout({ each: 8000 })));
  }

  login(data: any) {
    return this.send('auth.login', data);
  }

  register(data: any) {
    return this.send('auth.register', data);
  }

  refresh(refreshToken: string) {
    return this.send('auth.refresh', { refreshToken });
  }

}
