import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/find-user.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.insert(createUserDto);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    if ('password' in updateUserDto) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  findUserWishes(userId: number) {
    const user = new User();
    user.id = userId;
    return this.wishesRepository.find({
      relations: { user: true },
      where: { user: user },
    });
  }
}
