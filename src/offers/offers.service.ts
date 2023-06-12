import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  offerIsLegit(user: User, wish: Wish, offer: CreateOfferDto) {
    if (!wish) throw new NotFoundException('Виш не найден.');
    if (wish.owner.id === user.id)
      throw new BadRequestException('Нельзя скинуться на собственный виш.');
    if (Number(wish.raised) + Number(offer.amount) > wish.price) {
      throw new BadRequestException('Сумма превышает стоимость виша.');
    }
    return true;
  }

  async create(userId, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const user = await queryRunner.manager.findOneBy(User, { id: userId });
    const wish = await queryRunner.manager.findOne(Wish, {
      where: { id: createOfferDto.itemId },
      relations: { owner: true },
    });
    if (this.offerIsLegit(user, wish, createOfferDto)) {
      const newOffer = new Wish();
      Object.assign(newOffer, { ...createOfferDto, user, item: wish });
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.save(Wish, {
          ...wish,
          raised: Number(wish.raised) + Number(createOfferDto.amount),
        });
        await queryRunner.manager.save(Offer, newOffer);
        await queryRunner.commitTransaction();
        return {};
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('Внутренняя ошибка сервера.');
      } finally {
        await queryRunner.release();
      }
    }
  }

  findAllByUser(id: number) {
    return this.offersRepository.find({
      relations: ['user', 'item', 'item.owner'],
      where: {
        user: {
          id: id,
        },
      },
    });
  }

  findOne(id: number) {
    return this.offersRepository.findOne({
      relations: ['user', 'item', 'item.owner'],
      where: { id },
    });
  }
}
