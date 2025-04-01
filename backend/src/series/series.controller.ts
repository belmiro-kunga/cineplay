import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { CreateSeasonDto } from '../seasons/dto/create-season.dto';
import { CreateEpisodeDto } from '../episodes/dto/create-episode.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @Get()
  findAll() {
    return this.seriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(id);
  }

  @Post(':id/seasons')
  @UseGuards(JwtAuthGuard, AdminGuard)
  addSeason(
    @Param('id') id: string,
    @Body() createSeasonDto: CreateSeasonDto,
  ) {
    return this.seriesService.addSeason(id, createSeasonDto);
  }

  @Post('seasons/:id/episodes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  addEpisode(
    @Param('id') id: string,
    @Body() createEpisodeDto: CreateEpisodeDto,
  ) {
    return this.seriesService.addEpisode(id, createEpisodeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }

  @Post('episodes/:id/view')
  @UseGuards(JwtAuthGuard)
  incrementViews(@Param('id') id: string) {
    return this.seriesService.incrementViews(id);
  }

  @Post('episodes/:id/rating')
  @UseGuards(JwtAuthGuard)
  updateRating(
    @Param('id') id: string,
    @Body('rating') rating: number,
  ) {
    return this.seriesService.updateRating(id, rating);
  }
} 