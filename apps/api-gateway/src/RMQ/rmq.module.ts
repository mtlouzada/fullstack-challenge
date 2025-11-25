import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_CLIENTS } from './rmq.constants';

@Module({
  imports: [
    ClientsModule.register(
      RMQ_CLIENTS.map((c) => ({
        name: c.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
          queue: c.queue,
          queueOptions: { durable: true },
        },
      })),
    ),
  ],
  exports: [ClientsModule], 
})
export class RmqModule {}
