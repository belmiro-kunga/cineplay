import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { VideosModule } from '../videos/videos.module';
import { SeriesModule } from '../series/series.module';
import { ContentImportService } from './services/content-import.service';

@Module({
  imports: [
    UsersModule, 
    VideosModule, 
    SeriesModule,
    MulterModule.register({
      dest: './uploads/temp',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, ContentImportService],
})
export class AdminModule {} 