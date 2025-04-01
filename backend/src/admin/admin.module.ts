import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { VideosModule } from '../videos/videos.module';
import { SeriesModule } from '../series/series.module';

@Module({
  imports: [UsersModule, VideosModule, SeriesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {} 