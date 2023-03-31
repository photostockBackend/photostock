import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
            service: "gmail",
            auth: {
                user: config.get('GMAIL_ACCAUNT'),
                pass: config.get('GMAIL_PASSWORD'),
            },
        },
        defaults: {
          from: `"No Reply" <${config.get('GMAIL_ACCAUNT')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}