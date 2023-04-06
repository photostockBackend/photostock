import { ApiProperty } from "@nestjs/swagger";

export type TokensType = {
  accessToken: string;
  refreshToken: string;
};

export class ViewModelToken {
  @ApiProperty()
  accessToken: string
}
