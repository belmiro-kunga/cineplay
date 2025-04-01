import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeriesService } from './series.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  async findAll() {
    return this.seriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.seriesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(@Body() createSeriesDto: any) {
    return this.seriesService.create(createSeriesDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSeriesDto: any) {
    return this.seriesService.update(id, updateSeriesDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/seasons')
  async addSeason(@Param('id') id: string, @Body() createSeasonDto: any) {
    return this.seriesService.addSeason(id, createSeasonDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('seasons/:id/episodes')
  async addEpisode(@Param('id') id: string, @Body() createEpisodeDto: any) {
    return this.seriesService.addEpisode(id, createEpisodeDto);
  }
} 