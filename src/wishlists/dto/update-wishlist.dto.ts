import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import { ArrayNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsOptional()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
