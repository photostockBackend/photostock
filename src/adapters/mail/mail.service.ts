import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    frontendAddress: string,
    email: string,
    code: string,
    action: string,
  ) {
    const emailTemplate = (
      code: string,
    ) => `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
          <a href='${frontendAddress}/${action}=${code}'>complete registration</a>
        </p>`;

    await this.mailerService
      .sendMail({
        to: email,
        html: emailTemplate(code),
        subject: 'Registration vercel',
      })
      .catch((e) => {
        throw new HttpException(
          `Ошибка работы почты: ${JSON.stringify(e)}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
