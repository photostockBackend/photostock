import { IsArray, IsOptional, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostInputModel {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  postPhoto: Express.Multer.File;
}

export class UpdatePostInputModel {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;

  @ApiProperty({ description: 'array(number) of remaining photo id' })
  @IsOptional()
  @IsArray()
  remainingPhotos: number[];

  @ApiProperty({ description: 'array(number) of deleted photo id' })
  @IsOptional()
  @IsArray()
  deletedPhotos: number[];

  @ApiProperty({
    description: 'array of new files',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  newPhotos: Express.Multer.File;
}
