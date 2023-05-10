import { IsString, Length, Min } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { IsBoolean } from 'class-validator';

export class AttachCardInputModel {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(16)
  cardNumber: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(2)
  expMonth: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(2)
  expYear: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3)
  cvc: string;
}

export class CreateSubscriptionInputModel {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(0)
  period: number;

  @IsBoolean()
  renewal: boolean;
}

