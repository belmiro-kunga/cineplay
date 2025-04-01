import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSeasonDto {
  @IsNumber()
  seasonNumber: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;
} 