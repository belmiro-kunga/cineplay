import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Season } from './season.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  number: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  duration: number;

  @Column()
  videoUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => Season, (season) => season.episodes, { onDelete: 'CASCADE' })
  season: Season;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 