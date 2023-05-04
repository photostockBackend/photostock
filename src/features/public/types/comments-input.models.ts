import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateCommentInputModel {
  @ApiProperty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  text: string;
}
export class UpdateCommentInputModel extends CreateCommentInputModel {}
