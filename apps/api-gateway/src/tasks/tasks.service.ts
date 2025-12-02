import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly tasksClient: ClientProxy,
  ) {}

  private async send<T = any, R = any>(pattern: string, data: T): Promise<R> {
    try {
      const obs = this.tasksClient.send<R, T>(pattern, data);
      return await firstValueFrom(obs.pipe(timeout({ each: 8000 })));
    } catch (err) {
      console.error('[TasksService] RMQ error', err);
      throw new InternalServerErrorException('Tasks microservice error');
    }
  }

  findAll(page: number, size: number) {
    return this.send('tasks.findAll', { page, size });
  }

  create(dto: CreateTaskDto & { createdBy?: number }) {
    // se quiser usar createdBy/authorId depois, você pode incluir no dto
    return this.send('tasks.create', dto);
  }

  findOne(id: number) {
    return this.send('tasks.findOne', { id });
  }

  update(id: number, dto: UpdateTaskDto & { updatedBy?: number }) {
    return this.send('tasks.update', { id, dto });
  }

  remove(id: number) {
    return this.send('tasks.remove', { id });
  }

  addComment(taskId: number, dto: AddCommentDto & { authorId?: number }) {
    return this.send('tasks.addComment', { taskId, dto });
  }

  listComments(taskId: number, page: number, size: number) {
    return this.send('tasks.listComments', { taskId, page, size });
  }
}
