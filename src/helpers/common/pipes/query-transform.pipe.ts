import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PaginatorDto } from '../types/paginator.dto';

@Injectable()
export class QueryTransformPipe
  implements PipeTransform<PaginatorDto, PaginatorDto>
{
  transform(query: PaginatorDto, metadata: ArgumentMetadata): PaginatorDto {
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
