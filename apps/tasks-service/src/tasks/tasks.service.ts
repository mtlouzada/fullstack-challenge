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

  // ----------------------------------------------------
  // LIST WITH PAGINATION
  // ----------------------------------------------------
  async findAll({ page, size }: { page: number; size: number }) {
    const [items, total] = await this.tasksRepo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      relations: ['assignedUsers'],
      order: { createdAt: 'DESC' },
    });

    return { items, total, page, size };
  }

  // ----------------------------------------------------
  // CREATE TASK
  // ----------------------------------------------------
  async create(dto: CreateTaskDto): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Cast explícito para evitar overload errado
      const draft: DeepPartial<Task> = {
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        priority: dto.priority ?? Priority.MEDIUM,
        status: dto.status ?? Status.TODO,
      };

      const taskEntity = queryRunner.manager.create(Task, draft);

      const saved = await queryRunner.manager.save(Task, taskEntity);

      // Assign users
      if (dto.assignedUserIds?.length) {
        const relationDrafts: DeepPartial<TaskUser>[] = dto.assignedUserIds.map(
          (uid) => ({
            taskId: saved.id,
            userId: uid,
          }),
        );

        const relations = queryRunner.manager.create(TaskUser, relationDrafts);
        await queryRunner.manager.save(TaskUser, relations);
      }

      // Audit creation
      const auditDraft: DeepPartial<AuditLog> = {
        taskId: saved.id,
        userId: null,
        action: 'create',
        diff: `created task ${saved.title}`,
      };

      const audit = queryRunner.manager.create(AuditLog, auditDraft);
      await queryRunner.manager.save(audit);

      await queryRunner.commitTransaction();

      // Publish event
      this.notificationsClient.emit('task.created', {
        taskId: saved.id,
        task: saved,
      });

      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ----------------------------------------------------
  // FIND ONE
  // ----------------------------------------------------
  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: { id },
      relations: ['assignedUsers', 'comments'],
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  // ----------------------------------------------------
  // UPDATE TASK
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // DELETE TASK
  // ----------------------------------------------------
  async remove(id: number) {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);

    this.notificationsClient.emit('task.deleted', { taskId: id });
    return { deleted: true };
  }

  // ----------------------------------------------------
  // ADD COMMENT
  // ----------------------------------------------------
  async addComment(taskId: number, dto: CreateCommentDto): Promise<Comment> {
    const draft: DeepPartial<Comment> = {
      taskId,
      content: dto.content,
      authorId: undefined,
    };

    const entity = this.commentRepo.create(draft);
    const saved = await this.commentRepo.save(entity);

    const audit = this.auditRepo.create({
      taskId,
      userId: null,
      action: 'comment',
      diff: dto.content,
    });

    await this.auditRepo.save(audit);

    this.notificationsClient.emit('task.comment.created', {
      taskId,
      comment: saved,
    });

    return saved;
  }

  // ----------------------------------------------------
  // LIST COMMENTS
  // ----------------------------------------------------
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
