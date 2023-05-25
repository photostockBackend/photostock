import { ApiProperty } from '@nestjs/swagger';

export class PostUserViewModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  postPhotosId: number[];
}

export class PostsUserWithPaginationViewModel {
  @ApiProperty()
  pagesCount: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty({ type: PostUserViewModel })
  posts: PostUserViewModel[];
}

export class PostFileViewModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  original: string;
  @ApiProperty()
  preview: string;
}
