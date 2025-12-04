import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from '../notification.service';

@Injectable()
export class RmqListener {

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('task.created')
  async onTaskCreated(@Payload() data: any) {
    await this.notificationsService.create({
      taskId: data.taskId,
      type: "TASK_CREATED",
      message: `Nova tarefa criada (#${data.taskId})`
    });
  }

  @EventPattern('task.updated')
  async onTaskUpdated(@Payload() data: any) {
    await this.notificationsService.create({
      taskId: data.taskId,
      type: "TASK_UPDATED",
      message: `Tarefa #${data.taskId} foi atualizada`
    });
  }

  @EventPattern('task.comment.created')
  async onComment(@Payload() data: any) {
    await this.notificationsService.create({
      taskId: data.taskId,
      type: "COMMENT_ADDED",
      message: `Novo comentário na tarefa #${data.taskId}`
    });
  }
}
