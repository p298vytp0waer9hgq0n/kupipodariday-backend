import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  offerIsLegit(user: User, wish: Wish, offer: CreateOfferDto) {
    if (!wish) throw new NotFoundException('Виш не найден.');
    if (wish.owner.id === user.id)
      throw new BadRequestException('Нельзя скинуться на собственный виш.');
    if (Number(wish.raised) + Number(offer.amount) > wish.price)
      throw new BadRequestException('Сумма превышает стоимость виша.');
    return true;
  }

  async create(userId, createOfferDto: CreateOfferDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    const wish = await this.wishesRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: { owner: true },
    });
    if (this.offerIsLegit(user, wish, createOfferDto)) {
      this.wishesRepository.save({
        ...wish,
        raised: Number(wish.raised) + Number(createOfferDto.amount),
      });
      return this.offersRepository.save({
        ...createOfferDto,
        user,
        wish,
      });
    }
  }

  findAllByUser(id: number) {
    return this.offersRepository.find({
      relations: { user: true },
      where: {
        user: {
          id: id,
        },
      },
    });
  }

  findOne(id: number) {
    return this.offersRepository.findOneBy({ id });
  }
}
