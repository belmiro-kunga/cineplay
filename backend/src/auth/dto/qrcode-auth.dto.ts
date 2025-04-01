import { IsString, IsNotEmpty } from 'class-validator';

export class QRCodeGenerateDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class QRCodeValidateDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class QRCodeStatusDto {
  @IsString()
  @IsNotEmpty()
  token: string;
} 