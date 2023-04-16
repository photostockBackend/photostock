import {IsOptional, IsString, Length} from 'class-validator';
import {Transform, TransformFnParams} from 'class-transformer';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class CreatePostInputModel {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;

  @ApiProperty({type: 'string', format: 'binary'})
  postPhoto: Express.Multer.File;
}

export class UpdatePostInputModel {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;

  @ApiPropertyOptional({type: 'string', format: 'binary'})
  @IsOptional()
  postPhoto: Express.Multer.File;
}
