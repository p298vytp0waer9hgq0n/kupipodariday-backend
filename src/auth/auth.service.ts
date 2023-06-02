import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './dto/signin-user.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(createUserDto: CreateUserDto) {
    const passwd = createUserDto.password;
    const hash = passwd ? bcrypt.hashSync(passwd, 10) : '';
    const res = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    if (res) return this.usersService.findOneByName(createUserDto.username);
    return null;
  }

  async validatePasswd({ password, username }: SigninUserDto) {
    const user = await this.usersService.findOneByName(username);
    if (user) {
      console.log(user);
      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        delete user.password;
        return user;
      }
    }
    return null;
  }
}
