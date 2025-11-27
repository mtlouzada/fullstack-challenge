import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

import { Task, Priority, Status } from '../entities/task.entity';
import { TaskUser } from '../entities/task-user.entity';
import { Comment } from '../entities/comment.entity';
import { AuditLog } from '../entities/audit-log.entity';

import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    @InjectRepository(TaskUser) private taskUserRepo: Repository<TaskUser>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
    private dataSource: DataSource,

    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsClient: ClientProxy,
  ) {}

  //---------------------------------------------------------
  // LIST WITH PAGINATION
  //---------------------------------------------------------
  async findAll({ page, size }: { page: number; size: number }) {
    const [items, total] = await this.tasksRepo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      relations: ['assignedUsers'],
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, size };
  }

  //---------------------------------------------------------
  // CREATE TASK (100% corrigido para docker/typeorm)
  //---------------------------------------------------------
  async create(dto: CreateTaskDto): Promise<Task> {
    return await this.dataSource.transaction(async (manager) => {
      const draft: DeepPartial<Task> = {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        priority: dto.priority ?? Priority.MEDIUM,
        status: dto.status ?? Status.TODO,
      };

      const task = manager.create(Task, draft);
      const saved = await manager.save(Task, task);

      // Assign users
      if (dto.assignedUserIds?.length) {
        const relations = dto.assignedUserIds.map((uid) =>
          manager.create(TaskUser, {
            taskId: saved.id,
            userId: uid,
          }),
        );

        await manager.save(TaskUser, relations);
      }

      // Audit
      const audit = manager.create(AuditLog, {
        taskId: saved.id,
        action: 'create',
        userId: null,
        diff: `created task ${saved.title}`,
      });

      await manager.save(AuditLog, audit);

      // Emit only after commit (Nest garante)
      this.notificationsClient.emit('task.created', {
        taskId: saved.id,
        task: saved,
      });

      return saved;
    });
  }

  //---------------------------------------------------------
  // FIND ONE
  //---------------------------------------------------------
  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: { id },
      relations: ['assignedUsers', 'comments'],
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  //---------------------------------------------------------
  // UPDATE TASK
  //---------------------------------------------------------
  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const previous = { ...task };

    Object.assign(task, dto);
    const saved = await this.tasksRepo.save(task);

    const audit = this.auditRepo.create({
      taskId: saved.id,
      userId: null,
      action: 'update',
      diff: `prev: ${JSON.stringify(previous)} -> next: ${JSON.stringify(dto)}`,
    });

    await this.auditRepo.save(audit);

    this.notificationsClient.emit('task.updated', {
      taskId: saved.id,
      task: saved,
    });

    return saved;
  }

  //---------------------------------------------------------
  // DELETE TASK
  //---------------------------------------------------------
  async remove(id: number) {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);

    this.notificationsClient.emit('task.deleted', { taskId: id });
    return { deleted: true };
  }

  //---------------------------------------------------------
  // ADD COMMENT
  //---------------------------------------------------------
  async addComment(taskId: number, dto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepo.create({
      taskId,
      content: dto.content,
    });

    const saved = await this.commentRepo.save(comment);

    const audit = this.auditRepo.create({
      taskId,
      action: 'comment',
      userId: null,
      diff: dto.content,
    });

    await this.auditRepo.save(audit);

    this.notificationsClient.emit('task.comment.created', {
      taskId,
      comment: saved,
    });

    return saved;
  }

  //---------------------------------------------------------
  // LIST COMMENTS
  //---------------------------------------------------------
  async listComments(
    taskId: number,
    { page, size }: { page: number; size: number },
  ) {
    const [items, total] = await this.commentRepo.findAndCount({
      where: { taskId },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, size };
  }
}
