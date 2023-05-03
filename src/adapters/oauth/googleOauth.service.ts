import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

@Injectable()
export class GoogleOauthService {
  private readonly oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly configService: ConfigService,
  ) {
    const clientID = this.configService.get('GOOGLE_OAUTH2_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_OAUTH2_SECRET');
 
    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    );
  }

  async authenticate(token: string) {
    const {tokens} = await this.oauthClient.getToken(token);
    const user: Auth.LoginTicket = await this.oauthClient.verifyIdToken({
      idToken: tokens.id_token,
    });
    const currenUser = user.getPayload();

    return {
      email: currenUser.email,
      avatar_url: currenUser.picture,
      name: currenUser.name,
    }
  }
}