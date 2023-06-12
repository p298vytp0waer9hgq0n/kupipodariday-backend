import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  Get,
  Param,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindUserDto } from './dto/find-user.dto';
import { DataSource } from 'typeorm';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  @SerializeOptions({
    ignoreDecorators: true,
  })
  @Get('me')
  ownProfile(@Request() req) {
    return this.usersService.findOneById(req.user.id);
  }

  @SerializeOptions({
    ignoreDecorators: true,
  })
  @Patch('me')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  myWishes(@Request() req) {
    return this.usersService.findUserWishes(req.user.id);
  }

  @Post('find')
  find(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }

  @Get(':username')
  async userProfile(@Param('username') username: string) {
    return await this.usersService.findOneByName(username);
  }

  @Get(':username/wishes')
  userWishes(@Request() req, @Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }
}
