import { ApiProperty } from '@nestjs/swagger';

export class ProfileUserViewModel {
  @ApiProperty()
  username: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  surName: string;
  @ApiProperty()
  dateOfBirthday: Date;
  @ApiProperty()
  city: string;
  @ApiProperty()
  aboutMe: string;
  @ApiProperty()
  profilePhotoLink: string;
}
