import { ApiProperty } from '@nestjs/swagger';

export class ProfileUserViewModel {
  @ApiProperty()
  description: string;
  @ApiProperty()
  postPhoto: string;
}
