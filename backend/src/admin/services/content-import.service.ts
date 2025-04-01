import { Injectable, BadRequestException } from '@nestjs/common';
import { VideosService } from '../../videos/videos.service';
import { SeriesService } from '../../series/series.service';
import { 
  parseCSV, 
  cleanupTempFile, 
  VideoCSVRow, 
  SeriesCSVRow,
  parseArrayField,
  parseNumberField
} from '../utils/csv-parser';

@Injectable()
export class ContentImportService {
  constructor(
    private videosService: VideosService,
    private seriesService: SeriesService
  ) {}

  async importVideosFromCSV(file: Express.Multer.File, userId: string): Promise<{ imported: number; errors: string[] }> {
    if (!file) {
      throw new BadRequestException('Arquivo CSV não fornecido');
    }

    try {
      const videoRows = await parseCSV<VideoCSVRow>(file.path);
      const result = { imported: 0, errors: [] };

      for (const row of videoRows) {
        try {
          // Validações básicas
          if (!row.title || !row.fileUrl) {
            result.errors.push(`Linha com título "${row.title || 'Desconhecido'}" ignorada: título e URL do arquivo são obrigatórios`);
            continue;
          }

          let genres: number[] = [];
          try {
            genres = parseArrayField(row.genres, true) as number[];
          } catch (err) {
            result.errors.push(`Aviso: Erro ao processar gêneros para o vídeo "${row.title}": ${err.message}`);
          }

          // Criar o vídeo
          await this.videosService.create({
            title: row.title,
            originalTitle: row.originalTitle,
            description: row.description,
            fileName: row.fileUrl.split('/').pop() || 'video.mp4',
            fileUrl: row.fileUrl,
            thumbnailUrl: row.thumbnailUrl,
            releaseYear: parseNumberField(row.releaseYear),
            genres,
            ageRating: row.ageRating,
            cast: parseArrayField(row.cast, false) as string[],
            director: row.director,
            uploaderId: userId
          });

          result.imported++;
        } catch (err) {
          result.errors.push(`Erro ao importar o vídeo "${row.title}": ${err.message}`);
        }
      }

      // Limpar arquivo temporário
      cleanupTempFile(file.path);

      return result;
    } catch (error) {
      // Limpar arquivo temporário em caso de erro
      cleanupTempFile(file.path);
      throw new BadRequestException(`Erro ao processar o arquivo CSV: ${error.message}`);
    }
  }

  async importSeriesFromCSV(file: Express.Multer.File): Promise<{ imported: number; errors: string[] }> {
    if (!file) {
      throw new BadRequestException('Arquivo CSV não fornecido');
    }

    try {
      const seriesRows = await parseCSV<SeriesCSVRow>(file.path);
      const result = { imported: 0, errors: [] };

      for (const row of seriesRows) {
        try {
          // Validações básicas
          if (!row.title) {
            result.errors.push(`Linha ignorada: título da série é obrigatório`);
            continue;
          }

          let genres: number[] = [];
          try {
            genres = parseArrayField(row.genres, true) as number[];
          } catch (err) {
            result.errors.push(`Aviso: Erro ao processar gêneros para a série "${row.title}": ${err.message}`);
          }

          // Criar a série
          await this.seriesService.create({
            title: row.title,
            description: row.description,
            coverImage: row.thumbnailUrl,
            genres,
            featured: false
          });

          result.imported++;
        } catch (err) {
          result.errors.push(`Erro ao importar a série "${row.title}": ${err.message}`);
        }
      }

      // Limpar arquivo temporário
      cleanupTempFile(file.path);

      return result;
    } catch (error) {
      // Limpar arquivo temporário em caso de erro
      cleanupTempFile(file.path);
      throw new BadRequestException(`Erro ao processar o arquivo CSV: ${error.message}`);
    }
  }
} 