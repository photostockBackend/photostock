import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor() {
    super();
  }

  public validate = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (
      process.env.HTTP_BASIC_USER === username &&
      process.env.HTTP_BASIC_PASS === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
