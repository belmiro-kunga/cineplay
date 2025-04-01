import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { Series } from '../entities/series.entity';
import { Episode } from '../entities/episode.entity';
import { Season } from '../entities/season.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Season, Episode])],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {} 