import { IsEmail, IsString, IsBoolean, IsOptional, MinLength, IsEnum, IsUrl } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

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