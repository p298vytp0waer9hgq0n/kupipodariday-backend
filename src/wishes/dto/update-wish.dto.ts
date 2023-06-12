import { IsOptional, Length, Min, Equals } from 'class-validator';

export class UpdateWishDto {
  @Equals(undefined)
  name;

  @Equals(undefined)
  image;

  @Equals(undefined)
  link;

  @Equals(undefined)
  raised;

  @Equals(undefined)
  copied;

  @IsOptional()
  @Min(1)
  price: number;

  @IsOptional()
  @Length(1, 1024)
  description: string;
}
