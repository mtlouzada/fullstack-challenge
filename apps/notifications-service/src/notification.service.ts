import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification, NotificationType } from "./entities/notification.entity";
import { WebsocketGateway } from "./websocket.gateway";

interface NotificationInputDTO {
  taskId: number;
  type: NotificationType | string; // ← ainda permite string, mas vamos converter
  message: string;
}

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    private readonly ws: WebsocketGateway
  ) {}

  async create(data: NotificationInputDTO) {

    // 🔥 Convertendo string → enum corretamente
    const notification = this.repo.create({
      taskId: data.taskId,
      message: data.message,
      type: typeof data.type === "string" 
        ? NotificationType[data.type.toUpperCase() as keyof typeof NotificationType]
        : data.type,
    });

    const saved = await this.repo.save(notification);

    // 🔥 Broadcast Websocket
    this.ws.server.emit("notification:new", saved);

    return saved;
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: "DESC" } });
  }
}
