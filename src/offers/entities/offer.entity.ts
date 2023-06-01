import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Column({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn()
  @Column({ type: 'timestamptz' })
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.id)
  wish: Wish;

  @Column()
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
