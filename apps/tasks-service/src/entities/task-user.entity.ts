import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_user')
export class TaskUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Task, (task) => task.assignedUsers, { onDelete: 'CASCADE' })
  task: Task;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt: Date;
}
