import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validatePasswd({
      username: username,
      password: password,
    });
    if (!user) {
      throw new UnauthorizedException(
        'Неправильное имя пользователя или пароль.',
      );
    }
    return user;
  }
}
