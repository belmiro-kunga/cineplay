import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeAdminStatusDto {
  @IsBoolean({ message: 'O status de administrador deve ser um valor booleano' })
  @IsNotEmpty({ message: 'O status de administrador é obrigatório' })
  isAdmin: boolean;
} 