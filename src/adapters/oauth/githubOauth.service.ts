import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from "axios";

@Injectable()
export class GithubOauthService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async validate(code: string) {
    const requestData = {
      code,
      client_id: this.configService.get('GITHUB_OAUTH2_CLIENT_ID'),
      client_secret: this.configService.get('GITHUB_OAUTH2_SECRET'),
    };
    const resp = await axios.post(
      'https://github.com/login/oauth/access_token',
      requestData,
      {
        headers: {Accept: 'application/json'},
      }
    );
    if ('error' in resp.data) {
      console.log("-> error", resp.data);
    }
    return resp.data
  }

  async getGithubUserByToken(token:any) {
    const response = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token.access_token}`,
        },
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${token.access_token}`,
        },
      }),
    ]);

    const user = response[0].data;
    const {email} = response[1].data.find((emailObj:any) => emailObj.primary);

    return {
      avatar_url: user.avatar_url,
      name: user.name,
      email
    }
  }
}