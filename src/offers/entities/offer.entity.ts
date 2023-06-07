import { User } from 'src/users/entities/user.entity';
import { LocalBaseEntity } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends LocalBaseEntity {
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.id)
  item: Wish;

  @Column()
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
