import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { Series } from './entities/series.entity';
import { Season } from '../seasons/entities/season.entity';
import { Episode } from '../episodes/entities/episode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Series, Season, Episode]),
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {} 