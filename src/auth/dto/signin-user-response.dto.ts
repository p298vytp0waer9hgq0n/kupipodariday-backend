import { IsJWT } from 'class-validator';

export class SigninUserResponceDto {
  @IsJWT()
  access_token: string;
}
