import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegistrationInputModel {
  @ApiProperty({ description: 'user name' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 20)
  readonly username: string;

  @ApiProperty({ description: 'user email' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/)
  readonly email: string;

  @ApiProperty({ description: 'user password', minLength: 6, maxLength: 20 })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  readonly password: string;
}

export class LoginInputModel {
  @ApiProperty({ description: 'user name or user email' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  emailOrUsername: string;

  @ApiProperty({ description: 'user password' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  password: string;
}

export class PasswordRecoveryInputModel {
  @ApiProperty({ description: 'user email' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/)
  readonly email: string;
}

export class NewPasswordInputModel {
  @ApiProperty({ description: 'new password' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  readonly newPassword: string;

  @ApiProperty({ description: 'code from email' })
  @IsUUID(4)
  @IsString()
  readonly recoveryCode: string;
}

export class RegistrationConfirmationInputModel {
  @ApiProperty({ description: 'code from email' })
  @IsString()
  readonly code: string;
}

export class RegistrationEmailResendingInputModel {
  @ApiProperty({ description: 'email for resend confirmation-code' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  readonly email: string;
}
