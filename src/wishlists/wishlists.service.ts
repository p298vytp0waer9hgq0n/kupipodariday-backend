import { Injectable, UseGuards } from '@nestjs/common';
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

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
