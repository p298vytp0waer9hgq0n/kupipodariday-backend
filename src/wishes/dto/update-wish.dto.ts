import { IsOptional, Length, IsUrl, Min, IsNotIn, Equals } from 'class-validator';

export class UpdateWishDto {
  @Equals(undefined)
  name;

  @Equals(undefined)
  image;

  @Equals(undefined)
  link;

  @IsOptional()
  @Min(1)
  price: number;

  @IsOptional()
  @Length(1, 1024)
  description: string;
}
