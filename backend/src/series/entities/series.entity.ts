import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Season } from '../../seasons/entities/season.entity';

@Entity()
export class Series {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: 0 })
  totalSeasons: number;

  @Column({ default: 0 })
  totalEpisodes: number;

  @Column({ type: 'int', array: true, default: [] })
  genres: number[];

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  views: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @OneToMany(() => Season, season => season.series, { cascade: true })
  seasons: Season[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 