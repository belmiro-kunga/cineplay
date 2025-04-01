import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from '../entities/video.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: './uploads/videos',
          filename: (req, file, callback) => {
            const uniqueSuffix = uuidv4();
            const ext = extname(file.originalname);
            callback(null, `${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(mp4|mov|avi|mkv)$/)) {
            return callback(new Error('Apenas arquivos de vídeo são permitidos!'), false);
          }
          callback(null, true);
        },
        limits: {
          fileSize: 1024 * 1024 * 100, // 100MB
        },
      }),
    }),
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {} 