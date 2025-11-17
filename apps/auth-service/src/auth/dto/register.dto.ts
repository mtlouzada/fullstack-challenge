import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@teste.com',
    description: 'Endereço de email do usuário',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: 'userteste',
    description: 'Nome de usuário para a conta',
  })
  @IsString({ message: 'Nome de usuário deve ser uma string' })
  @IsNotEmpty({ message: 'Nome de usuário é obrigatório' })

  username: string;

  @ApiProperty({
    example: 'ABCD1234',
    description: 'Mínimo 6 caracteres',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}