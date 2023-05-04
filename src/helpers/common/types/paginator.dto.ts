import { Allow } from 'class-validator';

export class PaginatorDto {
  @Allow()
  pageNumber: number;
  @Allow()
  pageSize: number;
}
