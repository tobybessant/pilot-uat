import { injectable } from "tsyringe";
import { EmailService } from "../utils/emailService";
import { JwtService } from "../utils/jwtService";
import { IProjectInviteToken } from "../../dto/request/common/inviteToken";

@injectable()
export class InviteService {
  private readonly serverUrl = process.env.SERVER_URL || "http://localhost:8080";
  private readonly inviteUrl = this.serverUrl + "/invite/";

  constructor(
    private emailService: EmailService,
    private jwtService: JwtService
  ) { }

  public decodeInviteToken(token: string): IProjectInviteToken {
    return this.jwtService.decode(token);
  }

  public async inviteClient(projectId: string, emails: string[]) {
    for (const email of emails) {
      const token = this.jwtService.encode({ email, projectId, type: "Client"});
      await this.emailService.sendHtml(
        "Pilot UAT Project Invitation",
        email,
        `You have been invited to project: <a target="_blank" href=${this.inviteUrl + token}>Click here to accept</a>.`
      );
    }
  }
}