import { Module } from '@nestjs/common';
import { GoogleOauthService } from './googleOauth.service';
import { GithubOauthService } from './githubOauth.service';

@Module({
  imports: [],
  providers: [GoogleOauthService, GithubOauthService],
  exports: [GoogleOauthService, GithubOauthService],
})
export class OauthModule {}