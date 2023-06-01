import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Column({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn()
  @Column({ type: 'timestamptz' })
  updatedAt: string;

  @Column()
  username: string;

  @Column()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.id)
  wish: Wish[];

  @OneToMany(() => Offer, (offer) => offer.id)
  offer: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.id)
  wishlist: Wishlist[];
}
