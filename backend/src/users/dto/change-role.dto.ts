import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class ChangeRoleDto {
  @IsEnum(UserRole, { message: 'O perfil deve ser um dos seguintes valores: admin, subscriber, free_user, content_manager' })
  @IsNotEmpty({ message: 'O perfil é obrigatório' })
  role: UserRole;
} 