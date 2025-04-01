import { IsEmail, IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Por favor, forneça um email válido' })
  @IsOptional()
  email?: string;

  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
} 