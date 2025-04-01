import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Series } from '../../series/entities/series.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity()
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  seasonNumber: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: 0 })
  totalEpisodes: number;

  @ManyToOne(() => Series, series => series.seasons, { onDelete: 'CASCADE' })
  series: Series;

  @OneToMany(() => Episode, episode => episode.season, { cascade: true })
  episodes: Episode[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 