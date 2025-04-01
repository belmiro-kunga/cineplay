import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Series } from './series.entity';
import { Episode } from './episode.entity';

@Entity('seasons')
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  releaseYear: number;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @ManyToOne(() => Series, (series) => series.seasons, { onDelete: 'CASCADE' })
  series: Series;

  @OneToMany(() => Episode, (episode) => episode.season, {
    cascade: true,
    eager: true,
  })
  episodes: Episode[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 