import { IsDate, IsOptional, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class CreateProfileInputModel {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  username: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  name: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  surName: string;

  @Type(() => Date)
  @IsDate()
  birthday: Date; //возможно string, парсинг в дату происходит с часовым поясом

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  city: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 200)
  aboutMe: string;
}

export class UpdateProfileInputModel {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  username: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  name: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  surName: string;

  @Type(() => Date)
  @IsDate()
  birthday: Date; //возможно string, парсинг в дату происходит с часовым поясом

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  city: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 200)
  aboutMe: string;
}
