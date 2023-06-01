import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Column({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn()
  @Column({ type: 'timestamptz' })
  updatedAt: string;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({ type: 'decimal', precision: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.id)
  offers: Offer[];

  @Column()
  copied: number;
}
