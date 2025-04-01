import { Controller, Get, Patch, Param, Body, UseGuards, Post, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ContentImportService } from './services/content-import.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly contentImportService: ContentImportService
  ) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/admin-status')
  async setAdminStatus(
    @Param('id') id: string,
    @Body('isAdmin') isAdmin: boolean,
  ) {
    return this.adminService.setAdminStatus(id, isAdmin);
  }

  @Post('content/import/videos')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/temp',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `videos-import-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'text/csv' && file.originalname.split('.').pop() !== 'csv') {
        return cb(new Error('Apenas arquivos CSV são permitidos'), false);
      }
      cb(null, true);
    },
  }))
  async importVideos(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.contentImportService.importVideosFromCSV(file, req.user.sub);
  }

  @Post('content/import/series')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/temp',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `series-import-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'text/csv' && file.originalname.split('.').pop() !== 'csv') {
        return cb(new Error('Apenas arquivos CSV são permitidos'), false);
      }
      cb(null, true);
    },
  }))
  async importSeries(@UploadedFile() file: Express.Multer.File) {
    return this.contentImportService.importSeriesFromCSV(file);
  }
} 