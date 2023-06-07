import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
