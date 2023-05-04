import { ApiProperty } from '@nestjs/swagger';

export class CommentViewModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  text: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  avatarId: number;
}
export class CommentsByPostWithPaginationViewModel {
  @ApiProperty()
  pagesCount: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty({ type: CommentViewModel })
  comments: CommentViewModel[];
}
