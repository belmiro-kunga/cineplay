import { IsNotEmpty } from 'class-validator';

export class ImportSeriesDto {
  @IsNotEmpty({ message: 'O arquivo CSV é obrigatório' })
  file: Express.Multer.File;
} 