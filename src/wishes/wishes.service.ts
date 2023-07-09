import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, IsNull, Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(id, createWishDto: CreateWishDto) {
    return this.wishesRepository.save({
      ...createWishDto,
      owner: id,
      copied: 0,
      raised: 0,
    });
  }

  findLatest() {
    return this.wishesRepository.find({
      relations: { owner: true, offers: true },
      where: { offers: [{ hidden: false }, { id: IsNull() }] },
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  findPopular() {
    return this.wishesRepository.find({
      relations: { owner: true, offers: true },
      where: { offers: [{ hidden: false }, { id: IsNull() }] },
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findOne(id: number) {
    const result = await this.wishesRepository.findOne({
      relations: ['owner', 'offers', 'offers.user'],
      where: { id, offers: [{ hidden: false }, { id: IsNull() }] },
    });
    if (!result) throw new NotFoundException('Виш не найден.');
    return result;
  }

  async update(userId: number, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId)
      throw new UnauthorizedException('Нельзя изменять чужие виши.');
    if (wish.raised > 0 && updateWishDto.price)
      throw new ForbiddenException('На виш уже сбросились.');
    await this.wishesRepository.save({ ...updateWishDto, id });
    return {};
  }

  async remove(userId: number, id: number) {
    const wish = await this.findOne(id);
    if (wish.owner.id !== userId)
      throw new UnauthorizedException('Нельзя удалять чужие виши.');
    if (wish.raised > 0) throw new ForbiddenException('На виш уже сбросились.');
    await this.wishesRepository.delete(id);
    return wish;
  }

  async copy(userId, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const wish = await this.findOne(id);
    const newWish = { ...wish, owner: userId, copied: 0, raised: 0 };
    delete newWish.id;
    wish.copied++;
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Wish, wish);
      await queryRunner.manager.save(Wish, newWish);
      await queryRunner.commitTransaction();
      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Произошла ошибка сервера.');
    } finally {
      await queryRunner.release();
    }
  }
}
