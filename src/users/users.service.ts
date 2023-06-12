import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository } from 'typeorm';
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

  async checkUserConflict(name: string, email: string, id: number = null) {
    const nameFound = name && (await this.findOneByName(name));
    const emailFound =
      email && (await this.usersRepository.findOneBy({ email }));
    const nameConflict = nameFound && nameFound.id !== id;
    const emailConflict = emailFound && emailFound.id !== id;
    if (nameConflict || emailConflict)
      throw new ConflictException(
        `Пользователь с таким ${
          nameConflict ? 'именем' : 'мылом'
        } уже зарегистрирован.`,
      );
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    await this.checkUserConflict(createUserDto.username, createUserDto.email);
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
    await this.checkUserConflict(
      updateUserDto.username,
      updateUserDto.email,
      id,
    );
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
      relations: {
        owner: true,
        offers: true,
      },
      where: { owner: user, offers: [{ hidden: false }, { id: IsNull() }] },
    });
  }
}
