import { IsString, IsOptional, IsEnum, IsArray, ArrayUnique, IsISO8601 } from 'class-validator';
import { Priority, Status } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString() title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  assignedUserIds?: number[]; // array de user ids
}
