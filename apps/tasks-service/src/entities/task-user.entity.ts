import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_user')
export class TaskUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @Column()
  userId: number;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt: Date;
}
