import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.videosService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createVideoDto: any, 
    @UploadedFile() file: any, 
    @Request() req
  ) {
    // Em um ambiente real, o arquivo seria enviado para um serviço de armazenamento como S3
    const fileUrl = `uploads/videos/${file.filename}`;
    return this.videosService.create(
      createVideoDto,
      req.user,
      fileUrl,
      file.filename,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVideoDto: any) {
    return this.videosService.update(id, updateVideoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }

  @Post(':id/view')
  async incrementViews(@Param('id') id: string) {
    await this.videosService.incrementViews(id);
    return { success: true };
  }
} 