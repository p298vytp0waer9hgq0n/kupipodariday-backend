import { IsNotEmpty, IsUrl, Length, Min } from 'class-validator';

export class UserWishesDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  updatedAt: string;

  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @Min(1)
  price: number;

  @IsNotEmpty()
  raised: number;

  @IsNotEmpty()
  copied: number;

  @IsNotEmpty()
  @Length(1, 1024)
  description: string;
}
