import { IsDate, IsOptional, IsString, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const dateWithoutTimezone = (params: TransformFnParams): any => {
  const d = Number(params.value.split('.')[0]);
  const m = Number(params.value.split('.')[1]) - 1;
  const y = Number(params.value.split('.')[2]);
  return new Date(Date.UTC(y, m, d));
};
export class CreateProfileInputModel {
  @ApiProperty({ description: 'user-profile username' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  username: string;

  @ApiProperty({ description: 'user-profile name' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  firstName: string;

  @ApiProperty({ description: 'user-profile surname' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  lastName: string;

  @ApiProperty({ description: 'user-profile birthday' })
  @Transform(dateWithoutTimezone)
  @IsDate()
  birthday: Date; //возможно string, парсинг в дату происходит с часовым поясом

  @ApiProperty({ description: 'user-profile city' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  city: string;

  @ApiProperty({ description: 'user-profile about' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 200)
  aboutMe: string;

  @ApiProperty({ description: 'user-profile avatar' })
  @IsOptional()
  avatar: Express.Multer.File;
}

export class UpdateProfileInputModel {
  @ApiProperty({ description: 'user-profile username' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  username: string;

  @ApiProperty({ description: 'user-profile name' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  firstName: string;

  @ApiProperty({ description: 'user-profile surname' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  lastName: string;

  @ApiProperty({ description: 'user-profile birthday' })
  @IsOptional()
  @Transform(dateWithoutTimezone)
  @IsDate()
  birthday: Date;

  @ApiProperty({ description: 'user-profile city' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  city: string;

  @ApiProperty({ description: 'user-profile about' })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(0, 200)
  aboutMe: string;

  @ApiProperty({ description: 'user-profile avatar' })
  @IsOptional()
  avatar: Express.Multer.File;
}
