import { injectable } from "tsyringe";
import { EmailService } from "../utils/emailService";
import { JwtService } from "../utils/jwtService";

@injectable()
export class InviteService {
  private readonly inviteUrl = "http://localhost:8080/invitation/";

  constructor(
    private emailService: EmailService,
    private jwtService: JwtService
  ) { }

  public inviteClient(projectId: string, emails: string[]) {

    for (const email of emails) {
      const token = this.jwtService.encode({ email, projectId, });
      this.emailService.sendHtml(
        "Pilot UAT Project Invitation",
        email,
        `You have been invited to project: <a>${this.inviteUrl + token}</a>`
      );
    }

  }
}