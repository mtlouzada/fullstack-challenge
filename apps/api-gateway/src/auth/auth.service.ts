import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthService {
constructor(
@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
) {}

private async send(pattern: string, data: any) {
  try {
    await this.authClient.connect();
    const obs = this.authClient.send(pattern, data);
    return await firstValueFrom(obs.pipe(timeout({ each: 8000 })));
  } catch (err) {
    console.error('🔥 ERRO NO AUTH MICROSERVICE:', err);
    throw err;
  }
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