import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';

export class UserProfileResponseDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsNotEmpty()
  @Length(2, 200)
  about: string;

  @IsNotEmpty()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  updatedAt: string;

  @Exclude()
  password;
}
