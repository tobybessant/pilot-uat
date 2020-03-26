import { injectable } from "tsyringe";
import * as nodemailer from "nodemailer";
import Mail = require("nodemailer/lib/mailer");

@injectable()
export class EmailService {

  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "rafael.barton9@ethereal.email",
        pass: "xJ6gXyb7Tcvy4EY6RY"
      }
    });
  }

  public sendHtml(subject: string, to: string, html: string): void {
    this.transporter.sendMail({
      from: "<rafael.barton9@ethereal.email>",
      to,
      subject,
      html
    });
  }

  public sendPlaintext(subject: string, to: string, text: string): void {
    this.transporter.sendMail({
      from: "<rafael.barton9@ethereal.email>",
      to,
      subject,
      text
    });
  }
}
