import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { VideoQuality } from '../../entities/video.entity';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private wasabiS3: S3;
  private cloudflareR2: S3;

  constructor(private configService: ConfigService) {
    // Configuração do Wasabi
    this.wasabiS3 = new S3({
      endpoint: 'https://s3.wasabisys.com',
      region: this.configService.get('WASABI_REGION'),
      credentials: {
        accessKeyId: this.configService.get('WASABI_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('WASABI_SECRET_ACCESS_KEY'),
      },
    });

    // Configuração do Cloudflare R2
    this.cloudflareR2 = new S3({
      endpoint: this.configService.get('CLOUDFLARE_R2_ENDPOINT'),
      region: 'auto',
      credentials: {
        accessKeyId: this.configService.get('CLOUDFLARE_R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  private getResolutionSettings(quality: VideoQuality) {
    const settings = {
      [VideoQuality.SD]: { width: 854, height: 480, bitrate: '1000k' },
      [VideoQuality.HD]: { width: 1280, height: 720, bitrate: '2500k' },
      [VideoQuality.FULL_HD]: { width: 1920, height: 1080, bitrate: '5000k' },
    };
    return settings[quality];
  }

  async processVideo(inputPath: string, videoId: string): Promise<string[]> {
    const outputPaths: string[] = [];
    const qualities = Object.values(VideoQuality);

    for (const quality of qualities) {
      const settings = this.getResolutionSettings(quality);
      const outputPath = path.join(
        'uploads/temp',
        `${videoId}-${quality}.mp4`,
      );

      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .size(`${settings.width}x${settings.height}`)
          .videoBitrate(settings.bitrate)
          .format('mp4')
          .on('end', resolve)
          .on('error', reject)
          .save(outputPath);
      });

      outputPaths.push(outputPath);
    }

    return outputPaths;
  }

  private async uploadToProvider(
    filePath: string,
    key: string,
    provider: 'wasabi' | 'cloudflare',
  ): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
    const s3Client = provider === 'wasabi' ? this.wasabiS3 : this.cloudflareR2;
    const bucket = provider === 'wasabi' 
      ? this.configService.get('WASABI_BUCKET_NAME')
      : this.configService.get('CLOUDFLARE_R2_BUCKET_NAME');

    await s3Client.putObject({
      Bucket: bucket,
      Key: key,
      Body: fileStream,
      ContentType: 'video/mp4',
    });

    const baseUrl = provider === 'wasabi'
      ? `https://s3.${this.configService.get('WASABI_REGION')}.wasabisys.com/${bucket}`
      : this.configService.get('CLOUDFLARE_R2_PUBLIC_URL');

    return `${baseUrl}/${key}`;
  }

  async uploadVideo(
    filePath: string,
    videoId: string,
    quality: VideoQuality,
  ): Promise<{ wasabiUrl: string; cloudflareUrl: string }> {
    const key = `videos/${videoId}/${quality}.mp4`;

    const [wasabiUrl, cloudflareUrl] = await Promise.all([
      this.uploadToProvider(filePath, key, 'wasabi'),
      this.uploadToProvider(filePath, key, 'cloudflare'),
    ]);

    return { wasabiUrl, cloudflareUrl };
  }

  async cleanupTempFiles(filePaths: string[]): Promise<void> {
    await Promise.all(
      filePaths.map((filePath) =>
        fs.promises.unlink(filePath).catch(() => {
          // Ignora erros de exclusão
        }),
      ),
    );
  }
} 