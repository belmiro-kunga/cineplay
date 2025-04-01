import { IsNotEmpty } from 'class-validator';

export class ImportVideosDto {
  @IsNotEmpty({ message: 'O arquivo CSV é obrigatório' })
  file: Express.Multer.File;
} 