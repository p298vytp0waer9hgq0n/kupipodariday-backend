import { IsNotEmpty, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(1)
  amount: number;

  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
