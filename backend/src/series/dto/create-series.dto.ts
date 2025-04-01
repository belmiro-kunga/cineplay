import { IsString, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class CreateSeriesDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  genres?: number[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;
} 