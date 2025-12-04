import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  taskId: number;

  @ManyToOne(() => Task, (task) => task.auditLogs, { onDelete: 'CASCADE' })
  task: Task;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  diff?: string;

  @Column({ nullable: true })
  userId?: number;

  @CreateDateColumn()
  createdAt: Date;
}
