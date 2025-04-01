import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { StorageService } from './services/storage.service';
import { Video } from '../entities/video.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, User]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: './uploads/temp',
          filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype.match(/\/(mp4|avi|mov|wmv|flv|mkv)$/)) {
            cb(null, true);
          } else {
            cb(new Error('Formato de arquivo não suportado'), false);
          }
        },
        limits: {
          fileSize: configService.get('MAX_FILE_SIZE', 1024 * 1024 * 1024), // 1GB por padrão
        },
      }),
    }),
  ],
  controllers: [VideosController],
  providers: [VideosService, StorageService],
  exports: [VideosService],
})
export class VideosModule {} 