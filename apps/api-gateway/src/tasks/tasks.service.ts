import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly tasksClient: ClientProxy,
  ) {}

  findAll(page: number, size: number) {
    return this.tasksClient.send('tasks.findAll', { page, size });
  }

  create(dto: CreateTaskDto) {
    return this.tasksClient.send('tasks.create', dto);
  }

  findOne(id: number) {
    return this.tasksClient.send('tasks.findOne', { id });
  }

  update(id: number, dto: UpdateTaskDto) {
    return this.tasksClient.send('tasks.update', { id, dto });
  }

  remove(id: number) {
    return this.tasksClient.send('tasks.remove', { id });
  }

  // Comments -----------------------------------------

  addComment(taskId: number, dto: AddCommentDto) {
    return this.tasksClient.send('tasks.addComment', { taskId, dto });
  }

  listComments(taskId: number, page: number, size: number) {
    return this.tasksClient.send('tasks.listComments', {
      taskId,
      page,
      size,
    });
  }
}
