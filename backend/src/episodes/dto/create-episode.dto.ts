import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  title: string;

  @IsNumber()
  episodeNumber: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  duration: number;

  @IsString()
  @IsUrl()
  videoUrl: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;
} 