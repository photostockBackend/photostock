import { ApiProperty } from '@nestjs/swagger';

export class ProfileUserViewModel {
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  birthday: Date;
  @ApiProperty()
  city: string;
  @ApiProperty()
  aboutMe: string;
  @ApiProperty()
  profilePhotoLink: string;
}
