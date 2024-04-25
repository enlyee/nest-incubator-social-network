import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(userEmail: string, token: string): Promise<void> {
    const url = `https://somesite.com/confirm-email?code=${token}`;

    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Welcome! Confirm your Email',
      template: '../templates/confirmation',
      context: {
        name: 'Member',
        url,
        token,
      },
    });
  }
}
