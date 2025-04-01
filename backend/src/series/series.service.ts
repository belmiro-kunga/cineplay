import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';
import { Season } from '../seasons/entities/season.entity';
import { Episode } from '../episodes/entities/episode.entity';
import { CreateSeriesDto } from './dto/create-series.dto';
import { CreateSeasonDto } from '../seasons/dto/create-season.dto';
import { CreateEpisodeDto } from '../episodes/dto/create-episode.dto';

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

  async create(createSeriesDto: CreateSeriesDto): Promise<Series> {
    const series = this.seriesRepository.create(createSeriesDto);
    return this.seriesRepository.save(series);
  }

  async findAll(): Promise<Series[]> {
    return this.seriesRepository.find({
      relations: ['seasons', 'seasons.episodes'],
    });
  }

  async findOne(id: string): Promise<Series> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['seasons', 'seasons.episodes'],
    });

    if (!series) {
      throw new NotFoundException(`Série com ID ${id} não encontrada`);
    }

    return series;
  }

  async addSeason(seriesId: string, createSeasonDto: CreateSeasonDto): Promise<Season> {
    const series = await this.findOne(seriesId);
    
    const season = this.seasonRepository.create({
      ...createSeasonDto,
      series,
    });
    
    const savedSeason = await this.seasonRepository.save(season);
    
    // Atualizar o número total de temporadas da série
    series.totalSeasons += 1;
    await this.seriesRepository.save(series);
    
    return savedSeason;
  }

  async addEpisode(seasonId: string, createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    const season = await this.seasonRepository.findOne({
      where: { id: seasonId },
      relations: ['series'],
    });

    if (!season) {
      throw new NotFoundException(`Temporada com ID ${seasonId} não encontrada`);
    }

    const episode = this.episodeRepository.create({
      ...createEpisodeDto,
      season,
    });

    const savedEpisode = await this.episodeRepository.save(episode);

    // Atualizar o número total de episódios da temporada e da série
    season.totalEpisodes += 1;
    await this.seasonRepository.save(season);

    season.series.totalEpisodes += 1;
    await this.seriesRepository.save(season.series);

    return savedEpisode;
  }

  async remove(id: string): Promise<void> {
    const series = await this.findOne(id);
    await this.seriesRepository.remove(series);
  }

  async incrementViews(episodeId: string): Promise<void> {
    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId },
      relations: ['season', 'season.series'],
    });

    if (!episode) {
      throw new NotFoundException(`Episódio com ID ${episodeId} não encontrado`);
    }

    episode.views += 1;
    await this.episodeRepository.save(episode);
  }

  async updateRating(episodeId: string, rating: number): Promise<void> {
    const episode = await this.episodeRepository.findOne({
      where: { id: episodeId },
    });

    if (!episode) {
      throw new NotFoundException(`Episódio com ID ${episodeId} não encontrado`);
    }

    episode.rating = rating;
    await this.episodeRepository.save(episode);
  }
} 