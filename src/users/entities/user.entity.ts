import { Offer } from 'src/offers/entities/offer.entity';
import { LocalBaseEntity } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends LocalBaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ unique: true })
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
