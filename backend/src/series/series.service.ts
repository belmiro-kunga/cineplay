import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from '../entities/series.entity';
import { Season } from '../entities/season.entity';
import { Episode } from '../entities/episode.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(Season)
    private seasonRepository: Repository<Season>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
  ) {}

  async findAll(): Promise<Series[]> {
    return this.seriesRepository.find();
  }

  async findOne(id: string): Promise<Series> {
    const series = await this.seriesRepository.findOne({ where: { id } });
    
    if (!series) {
      throw new NotFoundException(`Série com ID ${id} não encontrada`);
    }
    
    return series;
  }

  async create(createSeriesDto: any): Promise<Series> {
    const series = this.seriesRepository.create(createSeriesDto);
    return await this.seriesRepository.save(series) as unknown as Series;
  }

  async update(id: string, updateSeriesDto: any): Promise<Series> {
    const series = await this.findOne(id);
    this.seriesRepository.merge(series, updateSeriesDto);
    return await this.seriesRepository.save(series) as unknown as Series;
  }

  async remove(id: string): Promise<void> {
    const series = await this.findOne(id);
    await this.seriesRepository.remove(series);
  }

  async addSeason(seriesId: string, createSeasonDto: any): Promise<Season> {
    const series = await this.findOne(seriesId);
    
    const season = this.seasonRepository.create({
      ...createSeasonDto,
      series,
    });
    
    return await this.seasonRepository.save(season) as unknown as Season;
  }

  async addEpisode(seasonId: string, createEpisodeDto: any): Promise<Episode> {
    const season = await this.seasonRepository.findOne({ where: { id: seasonId } });
    
    if (!season) {
      throw new NotFoundException(`Temporada com ID ${seasonId} não encontrada`);
    }
    
    const episode = this.episodeRepository.create({
      ...createEpisodeDto,
      season,
    });
    
    return await this.episodeRepository.save(episode) as unknown as Episode;
  }
} 