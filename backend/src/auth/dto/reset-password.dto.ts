import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'O token é obrigatório' })
  @IsString()
  token: string;
  
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número ou caractere especial',
  })
  password: string;
  
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  @IsString()
  passwordConfirmation: string;
} 