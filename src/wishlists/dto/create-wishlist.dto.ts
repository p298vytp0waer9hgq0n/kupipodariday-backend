import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
