import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Season } from './season.entity';

@Entity('series')
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  releaseYear: number;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  genres: string[];

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  isFeatured: boolean;

  @OneToMany(() => Season, (season) => season.series, {
    cascade: true,
    eager: true,
  })
  seasons: Season[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 