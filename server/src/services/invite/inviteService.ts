import { injectable } from "tsyringe";
import { EmailService } from "../utils/emailService";

@injectable()
export class InviteService {
  private readonly inviteUrl = "http://localhost:8080/invitation/";

  constructor(private emailService: EmailService) {

  }

  public inviteClient(projectId: string, emails: string[]) {
    this.emailService.sendPlaintext(
      "Pilot UAT Project Invitation",
      emails,
      "You have been invited to project: " + projectId
    );
  }
}