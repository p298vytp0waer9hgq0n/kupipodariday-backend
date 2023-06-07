import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/find-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const nameConflict = await this.findOneByName(createUserDto.username);
    const emailConflict = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (nameConflict || emailConflict)
      throw new ConflictException(
        `Пользователь с таким ${
          nameConflict ? 'именем' : 'мылом'
        } уже зарегистрирован.`,
      );
    return this.usersRepository.save(createUserDto);
  }

  findOneByName(name: string) {
    return this.usersRepository.findOneBy({ username: name });
  }

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async findMany({ query }: FindUserDto) {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :query OR user.email = :query', { query })
      .getMany();
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if ('password' in updateUserDto) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    await this.usersRepository.save({ ...updateUserDto, id });
    return this.findOneById(id);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async findUserWishes(userData: number | string) {
    const user = new User();
    if (typeof userData === 'string') {
      const userId = await this.findOneByName(userData);
      if (!userId) throw new NotFoundException('Пользователь не найден.');
      user.id = userId.id;
    } else user.id = userData;
    return this.wishesRepository.find({
      relations: ['owner', 'offers', 'offers.user'],
      where: { owner: user },
    });
  }
}
