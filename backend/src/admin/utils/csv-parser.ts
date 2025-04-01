import * as fs from 'fs';
import * as csv from 'csv-parser';

export interface VideoCSVRow {
  title: string;
  originalTitle?: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  releaseYear?: string;
  genres?: string;
  ageRating?: string;
  cast?: string;
  director?: string;
}

export interface SeriesCSVRow {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  genres?: string;
}

export interface SeasonCSVRow {
  seriesTitle: string;
  number: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface EpisodeCSVRow {
  seriesTitle: string;
  seasonNumber: string;
  number: string;
  title: string;
  description?: string;
  duration?: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

export async function parseCSV<T>(filePath: string): Promise<T[]> {
  const results: T[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data as T))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export function cleanupTempFile(filePath: string): void {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Erro ao excluir arquivo temporário: ${err.message}`);
    }
  });
}

export function parseArrayField(field?: string, convertToNumber: boolean = false): string[] | number[] {
  if (!field) return [];
  const items = field.split(',').map(item => item.trim()).filter(Boolean);
  if (convertToNumber) {
    return items.map(item => {
      const num = parseInt(item, 10);
      if (isNaN(num)) {
        throw new Error(`Valor inválido para conversão em número: ${item}`);
      }
      return num;
    });
  }
  return items;
}

export function parseNumberField(field?: string): number | null {
  if (!field) return null;
  const num = parseInt(field.trim(), 10);
  return isNaN(num) ? null : num;
} 