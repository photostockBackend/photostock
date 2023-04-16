import { ApiProperty } from '@nestjs/swagger';

export class PostUserViewModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  postPhoto: string;
}
