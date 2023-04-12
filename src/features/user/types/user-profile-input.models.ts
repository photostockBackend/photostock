import { IsDate, IsOptional, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileInputModel {
  @ApiProperty({ description: 'user username' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  username: string;

  @ApiProperty({ description: 'user name' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  name: string;

  @ApiProperty({ description: 'user surname' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  surName: string;

  @ApiProperty({ description: 'user birthday' })
  @Type(() => Date)
  @IsDate()
  birthday: Date; //возможно string, парсинг в дату происходит с часовым поясом

  @ApiProperty({ description: 'user city' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  city: string;

  @ApiProperty({ description: 'user about' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 200)
  aboutMe: string;

  @ApiProperty({ description: 'user avatar' })
  @IsOptional()
  avatar: Express.Multer.File;
}

export class UpdateProfileInputModel {
  @ApiProperty({ description: 'user username' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  username: string;

  @ApiProperty({ description: 'user name' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  name: string;

  @ApiProperty({ description: 'user surname' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  surName: string;

  @ApiProperty({ description: 'user birthday' })
  @Type(() => Date)
  @IsDate()
  birthday: Date; //возможно string, парсинг в дату происходит с часовым поясом

  @ApiProperty({ description: 'user city' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  city: string;

  @ApiProperty({ description: 'user about' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 200)
  aboutMe: string;

  @ApiProperty({ description: 'user avatar' })
  @IsOptional()
  avatar: Express.Multer.File;
}
