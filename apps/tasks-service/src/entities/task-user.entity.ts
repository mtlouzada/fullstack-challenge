import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_users')
@Unique(['taskId', 'userId'])
export class TaskUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  taskId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Task, (t) => t.assignedUsers, { onDelete: 'CASCADE' })
  task: Task;
}
