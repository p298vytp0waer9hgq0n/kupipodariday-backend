import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { LocalBaseEntity } from 'src/utils/base.entity';
import { Column, Entity, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Wish extends LocalBaseEntity {
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