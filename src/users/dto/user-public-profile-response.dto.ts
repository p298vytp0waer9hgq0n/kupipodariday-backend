import { OmitType } from '@nestjs/swagger';
import { UserProfileResponseDto } from './user-profile-response.dto';
import { User } from '../entities/user.entity';
import { Exclude } from 'class-transformer';

export class UserPublicProfileResponseDto extends UserProfileResponseDto {
  @Exclude()
  email;
}

/* export class UserPublicProfileResponseDto {
  id: number;
  username: string;

  static fromEntity(entity: User) {
    const dto = new UserPublicProfileResponseDto();
    dto.id = entity.id;
    dto.username = entity.username;
    return dto;
  }
} */
