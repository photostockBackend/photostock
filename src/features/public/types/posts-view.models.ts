import { ApiProperty } from '@nestjs/swagger';
import { CommentViewModel } from './comments-view.models';

export class PostWithNewestCommentsViewModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  postPhotos: string[];
  @ApiProperty({ type: [CommentViewModel], maxItems: 3 })
  newestComments: CommentViewModel[];
}
