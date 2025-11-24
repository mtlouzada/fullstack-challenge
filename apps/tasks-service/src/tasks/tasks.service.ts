import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, Priority, Status } from '../entities/task.entity';
import { TaskUser } from '../entities/task-user.entity';
import { Comment } from '../entities/comment.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepo: Repository<Task>,
    @InjectRepository(TaskUser) private taskUserRepo: Repository<TaskUser>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
    private dataSource: DataSource,
    @Inject('NOTIFICATIONS_SERVICE') private readonly notificationsClient: ClientProxy,
  ) {}

  async findAll({ page, size }: { page: number; size: number }) {
    const [items, total] = await this.tasksRepo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      relations: ['assignedUsers'],
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, size };
  }

  async create(dto: CreateTaskDto) {
    // transaction: create task and assignments and audit
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const task = this.tasksRepo.create({
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        priority: dto.priority ?? Priority.MEDIUM,
        status: dto.status ?? Status.TODO,
      });
      const saved = await queryRunner.manager.save(task);

      if (dto.assignedUserIds && dto.assignedUserIds.length) {
        const relations = dto.assignedUserIds.map((uid) =>
          this.taskUserRepo.create({ taskId: saved.id, userId: uid }),
        );
        await queryRunner.manager.save(relations);
      }

      await queryRunner.manager.save({
        taskId: saved.id,
        userId: null,
        action: 'create',
        diff: `created task ${saved.title}`,
      } as AuditLog);

      await queryRunner.commitTransaction();

      // publish event
      this.notificationsClient.emit('task.created', { taskId: saved.id, task: saved });

      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    const task = await this.tasksRepo.findOne({ where: { id }, relations: ['assignedUsers', 'comments'] });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    const prev = { ...task };
    Object.assign(task, dto);
    const saved = await this.tasksRepo.save(task);

    // record audit
    await this.auditRepo.save({
      taskId: saved.id,
      userId: null,
      action: 'update',
      diff: `prev: ${JSON.stringify(prev)} -> next: ${JSON.stringify(dto)}`,
    } as AuditLog);

    // publish
    this.notificationsClient.emit('task.updated', { taskId: saved.id, task: saved });
    return saved;
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);
    this.notificationsClient.emit('task.deleted', { taskId: id });
    return { deleted: true };
  }

  async addComment(taskId: number, dto: CreateCommentDto) {
    const comment = this.commentRepo.create({
      taskId,
      content: dto.content,
      authorId: null,
    });
    const saved = await this.commentRepo.save(comment);

    // audit
    await this.auditRepo.save({
      taskId,
      userId: null,
      action: 'comment',
      diff: dto.content,
    } as AuditLog);

    // publish
    this.notificationsClient.emit('task.comment.created', { taskId, comment: saved });
    return saved;
  }

  async listComments(taskId: number, { page, size }: { page: number; size: number }) {
    const [items, total] = await this.commentRepo.findAndCount({
      where: { taskId },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, size };
  }
}
