import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { QueryPostInputModel } from '../../../features/user/types/posts/user-post-input.models';

@Injectable()
export class QueryTransformPipe
  implements PipeTransform<QueryPostInputModel, QueryPostInputModel>
{
  transform(
    query: QueryPostInputModel,
    metadata: ArgumentMetadata,
  ): QueryPostInputModel {
    let pageNumber = query.pageNumber || 1;
    if (Number(pageNumber) < 1 || isNaN(Number(pageNumber))) pageNumber = 1;
    let pageSize = query.pageSize || 8;
    if (Number(pageSize) < 1 || isNaN(Number(pageSize))) pageSize = 8;
    return {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };
  }
}
