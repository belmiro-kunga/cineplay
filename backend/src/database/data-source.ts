import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração do DataSource
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: process.env.NODE_ENV !== 'production',
};

// Instância do DataSource para uso em scripts e migrations
const dataSource = new DataSource(dataSourceOptions);

export default dataSource; 