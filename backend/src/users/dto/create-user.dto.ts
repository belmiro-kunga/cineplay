import { IsEmail, IsNotEmpty, MinLength, IsString, IsBoolean, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Por favor, forneça um email válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsEnum(UserRole, { message: 'O perfil deve ser um dos seguintes valores: admin, subscriber, free_user, content_manager' })
  @IsOptional()
  role?: UserRole;

  @IsUrl({}, { message: 'A URL da foto de perfil deve ser válida' })
  @IsOptional()
  profilePicture?: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;
} 