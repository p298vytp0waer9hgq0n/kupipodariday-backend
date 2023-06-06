import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindUserDto } from './dto/find-user.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { plainToInstance } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  ownProfile(@Request() req) {
    return this.usersService.findOneById(req.user.id);
  }

  @Patch('me')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('find')
  find(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto);
  }

  /* @SerializeOptions({
    excludePrefixes: ['email'],
  }) */
  @Get(':username')
  async userProfile(@Param('username') username: string): Promise<UserPublicProfileResponseDto> {
    const user = await this.usersService.findOneByName(username);
    // const response = UserPublicProfileResponseDto.fromEntity(user);
    const response = plainToInstance(UserPublicProfileResponseDto, user);
    return response;
  }

  @Get('me/wishes')
  myWishes(@Request() req) {
    return this.usersService.findUserWishes(req.user.id);
  }
}
