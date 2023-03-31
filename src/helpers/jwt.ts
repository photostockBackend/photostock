import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWT {
    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
    ){}

    verify(token: string){
      return this.jwtService.verify(token, {secret: this.configService.get('JWT_SECRET')})
    }

    sign(payload: any, options){
      return this.jwtService.sign(payload, {...options, secret: this.configService.get('JWT_SECRET')})
    }
    
}