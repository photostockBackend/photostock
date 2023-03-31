import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {}

  async sendEmail(source: string, email: string, code: string, action: string) {
  
    const emailTemplate = (code: string) => `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
          <a href='${source}/${action}=${code}'>complete registration</a>
        </p>`
   
    await this.mailerService.sendMail({
        to: email,
        html: emailTemplate(code),
        subject: 'Registration vercel',
    })
  }
}