import { ApiProperty } from '@nestjs/swagger';

export class PaymentsViewModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  postPhotos: string[];
}

