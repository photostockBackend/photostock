import { ApiProperty } from '@nestjs/swagger';

export abstract class Paginated<T> {
  abstract items: T;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  pagesCount: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}
