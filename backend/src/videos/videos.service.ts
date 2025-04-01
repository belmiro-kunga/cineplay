import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Video, VideoQuality, VideoSource } from '../entities/video.entity';
import { User } from '../entities/user.entity';
import { StorageService } from './services/storage.service';
import { v4 as uuidv4 } from 'uuid';

interface CreateVideoDto {
  title: string;
  originalTitle?: string;
  description?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  releaseYear?: number;
  genres?: string[];
  ageRating?: string;
  cast?: string[];
  director?: string;
  isFeatured?: boolean;
}

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private storageService: StorageService,
  ) {}

  async findAll(): Promise<Video[]> {
    return this.videosRepository.find({ relations: ['uploader'] });
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.videosRepository.findOne({ 
      where: { id },
      relations: ['uploader']
    });
    
    if (!video) {
      throw new NotFoundException(`Vídeo com ID ${id} não encontrado`);
    }
    
    return video;
  }

  async createWithUpload(
    createVideoDto: CreateVideoDto,
    uploader: User,
    filePath: string,
  ): Promise<Video> {
    const videoId = uuidv4();
    const processedFiles = await this.storageService.processVideo(filePath, videoId);
    
    const sources: VideoSource[] = [];
    
    for (const [index, quality] of Object.values(VideoQuality).entries()) {
      const { wasabiUrl, cloudflareUrl } = await this.storageService.uploadVideo(
        processedFiles[index],
        videoId,
        quality,
      );
      
      sources.push(
        {
          quality,
          url: wasabiUrl,
          provider: 'wasabi',
        },
        {
          quality,
          url: cloudflareUrl,
          provider: 'cloudflare',
        },
      );
    }
    
    await this.storageService.cleanupTempFiles([filePath, ...processedFiles]);
    
    const videoData: DeepPartial<Video> = {
      ...createVideoDto,
      id: videoId,
      uploader,
      sources,
    };
    
    const video = this.videosRepository.create(videoData);
    return this.videosRepository.save(video);
  }

  async update(id: string, updateVideoDto: Partial<CreateVideoDto>): Promise<Video> {
    const video = await this.findOne(id);
    this.videosRepository.merge(video, updateVideoDto);
    return this.videosRepository.save(video);
  }

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);
    await this.videosRepository.remove(video);
  }

  async incrementViews(id: string): Promise<void> {
    const video = await this.findOne(id);
    video.views += 1;
    await this.videosRepository.save(video);
  }
} 