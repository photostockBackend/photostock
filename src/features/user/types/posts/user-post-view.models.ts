import { ApiProperty } from '@nestjs/swagger';

export class ProfileUserViewModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  postPhoto: string;
}
