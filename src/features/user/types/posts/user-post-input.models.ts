import { IsOptional, IsString, Length } from 'class-validator';
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

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  postPhoto: Express.Multer.File;
}
