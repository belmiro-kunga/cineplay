import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { VideosService } from '../videos/videos.service';
import { SeriesService } from '../series/series.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private videosService: VideosService,
    private seriesService: SeriesService,
  ) {}

  async getDashboardStats() {
    const [users, videos, series] = await Promise.all([
      this.usersService.findAll(),
      this.videosService.findAll(),
      this.seriesService.findAll(),
    ]);

    return {
      totalUsers: users.length,
      totalVideos: videos.length,
      totalSeries: series.length,
      recentUsers: users.slice(-5).reverse(),
      recentVideos: videos.slice(-5).reverse(),
      recentSeries: series.slice(-5).reverse(),
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async setAdminStatus(userId: string, isAdmin: boolean) {
    return this.usersService.update(userId, { isAdmin });
  }
} 