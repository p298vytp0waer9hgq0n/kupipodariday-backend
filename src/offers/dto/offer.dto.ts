import { IsNotEmpty } from 'class-validator';

export class OfferDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  updatedAt: string;

  @IsNotEmpty()
  item: string;
}
