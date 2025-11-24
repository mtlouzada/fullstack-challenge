import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  taskId: number;

  @Column()
  authorId: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Task, (t) => t.comments, { onDelete: 'CASCADE' })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;
}
