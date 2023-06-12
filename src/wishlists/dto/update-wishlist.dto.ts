import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

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
