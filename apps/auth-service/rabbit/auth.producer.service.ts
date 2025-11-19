import { Injectable } from "@nestjs/common";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class AuthProducer {
  constructor(private readonly amqp: AmqpConnection) {}

  sendWelcomeEvent(email: string) {
    this.amqp.publish("auth.exchange", "auth.user_registered", { email });
  }
}
