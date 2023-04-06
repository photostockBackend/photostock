import { ApiProperty } from "@nestjs/swagger";

export class AuthMeViewModel {
  @ApiProperty()
  email: string;
  @ApiProperty()
  userId: number;
}

export class ViewModelToken {
  @ApiProperty()
  accessToken: string
}