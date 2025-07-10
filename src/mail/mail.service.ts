import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import axios from 'axios';

@Injectable()
export class MailService {
  async sendMail(dto: SendMailDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: dto.to,
        subject: dto.subject,
        html: dto.message,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { messageId: info.messageId };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }
  async sendWithSendGrid(dto: SendMailDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const res = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [{ to: [{ email: dto.to }] }],
        from: { email: process.env.SENDGRID_SENDER },
        subject: dto.subject,
        content: [{ type: 'text/html', value: dto.message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { status: res.status };
  }
  async fetchUserListFromPublicApi() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return res.data;
  }
}
