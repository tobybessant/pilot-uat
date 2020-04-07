import { injectable } from "tsyringe";
import * as nodemailer from "nodemailer";
import Mail = require("nodemailer/lib/mailer");

@injectable()
export class EmailService {

  private transporter: Mail;
  private senderEmail: string = `<${process.env.MAILER_USER}>`;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST || "",
      port: Number(process.env.MAILER_PORT) || 0,
      auth: {
        user: process.env.MAILER_USER || "",
        pass: process.env.MAILER_PASSWORD || ""
      },
      tls: {
        rejectUnauthorized: false,

      }
    });
  }

  public async sendHtml(subject: string, to: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.senderEmail,
      to,
      subject,
      html
    });
  }

  public async sendPlaintext(subject: string, to: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.senderEmail,
      to,
      subject,
      text
    });
  }
}
