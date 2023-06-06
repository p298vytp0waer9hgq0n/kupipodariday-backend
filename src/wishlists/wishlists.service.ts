import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId, createWishlistDto: CreateWishlistDto) {
    const items = createWishlistDto.itemsId.map((ele) => {
      const wish = new Wish();
      wish.id = ele;
      return wish;
    });
    return this.wishlistRepository.save({
      ...createWishlistDto,
      owner: userId,
      items: items,
    });
  }

  findAll(id: number) {
    return this.wishlistRepository.find({
      relations: { owner: true },
      where: {
        owner: {
          id: id,
        },
      },
    });
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({
      relations: { items: true, owner: true },
      where: { id },
    });
  }

  async update(userId, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findOne(id);
    if (!wishlist) throw new NotFoundException('Вишлист не найден.');
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (user.id !== wishlist.owner.id)
      throw new UnauthorizedException('Нельзя менять чужие вишлисты.');
    return this.wishlistRepository.save({
      id,
      ...updateWishlistDto,
    });
  }

  async remove(userId, id: number) {
    const wishlist = await this.findOne(id);
    if (!wishlist) throw new NotFoundException('Вишлист не найден.');
    if (wishlist.owner.id !== userId)
      throw new UnauthorizedException('Нельзя удалять чужие вишлисты.');
    return this.wishlistRepository.delete(id);
  }
}
