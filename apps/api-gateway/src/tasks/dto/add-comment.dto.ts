import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({ example: 'Ótima tarefa!' })
  @IsString()
  @MinLength(1)
  content: string;
}
