import { UserProfileResponseDto } from './user-profile-response.dto';
import { Exclude } from 'class-transformer';

export class UserPublicProfileResponseDto extends UserProfileResponseDto {
  @Exclude()
  email;
}
