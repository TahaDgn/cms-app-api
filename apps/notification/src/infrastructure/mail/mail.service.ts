import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from 'libs/constants';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });
  }

  public async sendWelcomeEmail(
    email: string,
    name: string,
    accessUrl: string,
  ) {
    const htmlContent = this.compileTemplate('welcome.hbs', {
      name,
      accessUrl,
    });
    const mailOptions: nodemailer.SendMailOptions = {
      from: '"CMS App" <no-reply@cms-app.com>',
      to: email,
      subject: 'Welcome to CMS App',
      html: htmlContent,
    };
    await this.transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  }

  public async sendLoginEmail(email: string, name: string, accessUrl: string) {
    const htmlContent = this.compileTemplate('login.hbs', { name, accessUrl });
    const mailOptions: nodemailer.SendMailOptions = {
      from: '"CMS App" <no-reply@cms-app.com>',
      to: email,
      subject: 'Login Link for CMS App',
      html: htmlContent,
    };
    await this.transporter.sendMail(mailOptions);
    console.log(`Login email sent to ${email}`);
  }

  public async sendUserDeletedEmail(
    email: string,
    name: string,
    userType: string,
  ) {
    const htmlContent = this.compileTemplate('user-deleted.hbs', {
      name,
      userType,
    });
    const mailOptions: nodemailer.SendMailOptions = {
      from: '"CMS App" <no-reply@cms-app.com>',
      to: email,
      subject: 'Your CMS Access Removed',
      html: htmlContent,
    };
    await this.transporter.sendMail(mailOptions);
    console.log(`User-deleted email sent to ${email}`);
  }

  private compileTemplate(templateFilename: string, data: any): string {
    const templatePath = path.join(__dirname, 'templates', templateFilename);
    const templateFile = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateFile);
    return template(data);
  }
}
