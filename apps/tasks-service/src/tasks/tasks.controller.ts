import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';

@Controller()
export class RpcTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('tasks.findAll')
  findAll(@Payload() data: { page: number; size: number }) {
    return this.tasksService.findAll(data);
  }

  @MessagePattern('tasks.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.tasksService.findOne(data.id);
  }

  @MessagePattern('tasks.create')
  create(@Payload() data: any) {
    return this.tasksService.create(data);
  }

  @MessagePattern('tasks.update')
  update(@Payload() data: { id: number; dto: any }) {
    return this.tasksService.update(data.id, data.dto);
  }

  @MessagePattern('tasks.remove')
  remove(@Payload() data: { id: number }) {
    return this.tasksService.remove(data.id);
  }

  @MessagePattern('tasks.addComment')
  addComment(@Payload() data: { taskId: number; dto: any }) {
    return this.tasksService.addComment(data.taskId, data.dto);
  }

  @MessagePattern('tasks.listComments')
  listComments(
    @Payload() data: { taskId: number; page: number; size: number },
  ) {
    return this.tasksService.listComments(data.taskId, {
      page: data.page,
      size: data.size,
    });
  }
}
