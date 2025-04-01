import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../entities/video.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
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

  async create(createVideoDto: any, uploader: any, fileUrl: string, fileName: string): Promise<Video> {
    const video = this.videosRepository.create({
      ...createVideoDto,
      uploader,
      fileUrl,
      fileName,
    });
    
    return await this.videosRepository.save(video) as unknown as Video;
  }

  async update(id: string, updateVideoDto: any): Promise<Video> {
    const video = await this.findOne(id);
    this.videosRepository.merge(video, updateVideoDto);
    return await this.videosRepository.save(video) as unknown as Video;
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