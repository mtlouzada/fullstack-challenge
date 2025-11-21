import { Injectable } from "@nestjs/common";

interface AmqpConnection {
  publish(exchange: string, routingKey: string, message: any): void;
}

@Injectable()
export class AuthProducer {
  constructor(private readonly amqp: AmqpConnection) {}

  sendWelcomeEvent(email: string) {
    this.amqp.publish("auth.exchange", "auth.user_registered", { email });
  }
}
