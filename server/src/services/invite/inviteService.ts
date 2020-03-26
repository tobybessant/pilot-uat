import { injectable } from "tsyringe";
import { EmailService } from "../utils/emailService";
import { JwtService } from "../utils/jwtService";

@injectable()
export class InviteService {
  private readonly inviteUrl = "http://localhost:8080/invite/";

  constructor(
    private emailService: EmailService,
    private jwtService: JwtService
  ) { }

  public decodeInviteToken(token: string): any {
    return this.jwtService.decode(token);
  }

  public inviteClient(projectId: string, emails: string[]) {
    for (const email of emails) {
      const token = this.jwtService.encode({ email, projectId, type: "Client"});
      this.emailService.sendHtml(
        "Pilot UAT Project Invitation",
        email,
        `You have been invited to project: <a target="_blank" href=${this.inviteUrl + token}>Click here to accept</a>.`
      );
    }
  }
}