import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
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
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.id)
  items: Wish[];
}
