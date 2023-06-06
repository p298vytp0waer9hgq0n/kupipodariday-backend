import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(id: number, createWishDto: CreateWishDto) {
    const user = await this.usersRepository.findOneBy({ id });
    return this.wishesRepository.save({
      ...createWishDto,
      user,
      copied: 0,
      raised: 0,
    });
  }

  findLatest() {
    return this.wishesRepository.find({
      relations: { user: true, offers: true },
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  findPopular() {
    return this.wishesRepository.find({
      relations: { user: true },
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  findOne(id: number) {
    return this.wishesRepository.findOne({
      relations: { user: true },
      where: { id },
    });
  }

  async update(userId: number, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (wish.user.id !== userId)
      throw new UnauthorizedException('Нельзя изменять чужие виши.');
    if (wish.raised > 0)
      throw new BadRequestException('На виш уже сбросились.');
    return this.wishesRepository.save({ ...updateWishDto, id });
  }

  async remove(userId: number, id: number) {
    const wish = await this.findOne(id);
    if (!wish) throw new NotFoundException();
    if (wish.user.id !== userId)
      throw new UnauthorizedException('Нельзя удалять чужие виши.');
    return this.wishesRepository.delete(id);
  }
}
