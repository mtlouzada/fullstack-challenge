import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany
} from 'typeorm';
import { TaskUser } from './task-user.entity';
import { Comment } from './comment.entity';
import { AuditLog } from './audit-log.entity';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Column({ type: 'enum', enum: Priority, default: Priority.MEDIUM })
  priority: Priority;

  @Column({ type: 'enum', enum: Status, default: Status.TODO })
  status: Status;

  // many-to-many with users via pivot
  @OneToMany(() => TaskUser, (tu) => tu.task, { cascade: true })
  assignedUsers: TaskUser[];

  @OneToMany(() => Comment, (c) => c.task, { cascade: true })
  comments: Comment[];

  @OneToMany(() => AuditLog, (a) => a.task, { cascade: true })
  auditLogs: AuditLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
