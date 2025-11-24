import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  taskId: number;

  @Column()
  userId: number;

  @Column({ type: 'text' })
  action: string; // e.g. 'update', 'assign', 'comment'

  @Column({ type: 'text', nullable: true })
  diff: string; // short description

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task, (t) => t.auditLogs, { onDelete: 'CASCADE' })
  task: Task;
}
