import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createWishDto: CreateWishDto) {
    const id = req.user.id;
    return this.wishesService.create(id, createWishDto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLatest();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findPopular();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(req.user.id, +id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.wishesService.remove(req.user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  copy(@Request() req, @Param('id') id: string) {
    return this.wishesService.copy(req.user.id, +id);
  }
}
