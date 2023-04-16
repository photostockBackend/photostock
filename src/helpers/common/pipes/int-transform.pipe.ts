import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IntTransformPipe implements PipeTransform<any, number> {
  transform(value: any, metadata: ArgumentMetadata): number {
    const result = Number(value);
    if (isNaN(result) || !value || result > 2147483647 || result < -2147483648)
      throw new NotFoundException();
    return result;
  }
}
