import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length, Matches } from 'class-validator';

export class RegistrationInputModel {
  @ApiProperty({ description: 'user email' })
  @IsString()
  @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/)
  readonly email: string;

  @ApiProperty({ description: 'user password', minLength: 6, maxLength: 20 })
  @IsString()
  @Length(6, 20)
  readonly password: string;
}

export class LoginInputModel {
  @ApiProperty({ description: 'user email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'user password' })
  @IsString()
  password: string;
}

export class PasswordRecoveryInputModel {
  @ApiProperty({ description: 'user email' })
  @IsString()
  @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4}$)/)
  readonly email: string;
}

export class NewPasswordInputModel {
  @ApiProperty({ description: 'new password' })
  @IsString()
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
  readonly email: string;
}
