import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('increment')
  id?: number;                // opcional

  @Column()
  taskId: number;

  @Column({ type: 'int', nullable: true })
  userId: number | null;


  @Column({ type: 'text' })
  action: string; // e.g. 'update', 'assign', 'comment'

  @Column({ type: 'text', nullable: true })
  diff?: string; // short description

  @CreateDateColumn()
  createdAt?: Date;          // opcional

  @ManyToOne(() => Task, (t) => t.auditLogs, { onDelete: 'CASCADE' })
  task: Task;
}
