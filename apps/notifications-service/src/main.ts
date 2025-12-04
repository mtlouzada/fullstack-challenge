import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  const urls = [process.env.RABBITMQ_URL].filter(Boolean) as string[];

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls,
      queue: "tasks_queue",
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3004);
  console.log("🚀 Notification-service online + WS ativo");
}

bootstrap();
