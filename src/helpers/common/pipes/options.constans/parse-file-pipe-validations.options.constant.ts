//Опции ParseFilePipe
import {
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

export const parseFilePipeValidationsOptions = (
  field: string,
  size: number,
  required: boolean,
) => {
  return {
    fileIsRequired: required,
    validators: [
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      new MaxFileSizeValidator({ maxSize: 1024 * size }),
    ],
    exceptionFactory: (error) => {
      throw new BadRequestException({
        message: [
          {
            field: field,
            message: error,
          },
        ],
      });
    },
  };
};
