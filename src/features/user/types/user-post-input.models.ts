import {IsOptional, IsString, Length} from 'class-validator';
import {Transform, TransformFnParams} from 'class-transformer';
import {ApiProperty} from '@nestjs/swagger';

export class CreatePostInputModel {
  @ApiProperty({ description: 'user-post description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;

  @ApiProperty({ description: 'user-post photo' })
  @IsOptional()
  postPhoto: Express.Multer.File;
}

export class UpdatePostInputModel {
  @ApiProperty({ description: 'user-post description' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;

  @ApiProperty({ description: 'user-post photo' })
  @IsOptional()
  postPhoto: Express.Multer.File;
}
