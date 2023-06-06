import { User } from 'src/users/entities/user.entity';
import { LocalBaseEntity } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Wishlist extends LocalBaseEntity {
  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.id)
  items: Wish[];
}
