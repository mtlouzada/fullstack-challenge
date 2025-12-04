import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Notification } from "./entities/notification.entity";
import { NotificationsService } from "./notification.service";
import { NotificationsController } from "./notifications.controller";
import { RmqListener } from "./listeners/rmq.listener";
import { WebsocketGateway } from "./websocket.gateway";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, RmqListener, WebsocketGateway],
})
export class NotificationModule {}
