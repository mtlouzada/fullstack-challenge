import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsArray, ArrayUnique, IsDateString, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Título da tarefa', example: 'Estudar NestJS' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ description: 'Descrição da tarefa', example: 'Microserviços com NestJS e RMQ', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  description?: string;

  @ApiProperty({ description: 'Prazo (ISO date string)', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ enum: ['LOW','MEDIUM','HIGH','URGENT'], required: false })
  @IsOptional()
  @IsEnum(['LOW','MEDIUM','HIGH','URGENT'] as any)
  priority?: 'LOW'|'MEDIUM'|'HIGH'|'URGENT';

  @ApiProperty({ enum: ['TODO','IN_PROGRESS','REVIEW','DONE'], required: false })
  @IsOptional()
  @IsEnum(['TODO','IN_PROGRESS','REVIEW','DONE'] as any)
  status?: 'TODO'|'IN_PROGRESS'|'REVIEW'|'DONE';

  @ApiProperty({ description: 'IDs dos usuários atribuídos', required: false, example: [1,2] })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  assignedUserIds?: number[];
}
