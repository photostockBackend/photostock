import { Type, applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Errored } from '../types/errored';

export const ApiResponseError = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(Errored, dataDto),
    ApiBadRequestResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Errored) },
          {
            properties: {
              errorMessages: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
