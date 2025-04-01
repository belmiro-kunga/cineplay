import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum VideoQuality {
  SD = '480p',
  HD = '720p',
  FULL_HD = '1080p'
}

export interface VideoSource {
  quality: VideoQuality;
  url: string;
  provider: 'wasabi' | 'cloudflare';
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  originalTitle: string;

  @Column({ nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  sources: VideoSource[];

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ nullable: true })
  releaseYear: number;

  @Column('text', { array: true, default: [] })
  genres: string[];

  @Column({ nullable: true })
  ageRating: string;

  @Column('text', { array: true, default: [] })
  cast: string[];

  @Column({ nullable: true })
  director: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  views: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  uploader: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 