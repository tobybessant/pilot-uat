import { Component, OnInit, Input } from "@angular/core";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { NbDialogService } from "@nebular/theme";
import { InviteUserDialogComponent } from "../invite-user-dialog/invite-user-dialog.component";
import { InviteApiService } from "src/app/services/api/invite/invite-api.service";
import { SessionService } from "src/app/services/session/session.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {

  @Input()
  projectId: string;

  projectUsers: IUserResponse[] = [];

  openInvites: any[] = [];

  constructor(
    private projectApiService: ProjectApiService,
    private inviteApiService: InviteApiService,
    private sessionService: SessionService,
    private dialogService: NbDialogService
  ) { }

  async ngOnInit(): Promise<void> {
    Promise.all([
      this.fetchProjectUsers(),
      this.fetchOpenInvites()
    ]);
  }

  public showInviteClientsDialog(): void {
    this.dialogService.open(InviteUserDialogComponent, {
      context: {
        projectId: this.projectId
      }
    }).onClose.subscribe(async emailList => {
      if (emailList.length > 0) {
        await this.fetchOpenInvites();
      }
    });
  }

  private async fetchOpenInvites() {
    const invites = await this.projectApiService.getProjectOpenInvites(this.projectId);
    this.openInvites = invites.payload;
  }

  private async fetchProjectUsers() {
    const users = await this.projectApiService.getUsersForProject(this.projectId);
    this.projectUsers = users.payload;
  }

  public async removeUserFromProject(user: IUserResponse) {
    await this.projectApiService.removeUserFromProject(user.id, this.projectId);
    this.fetchProjectUsers();
  }

  public async revokeInvite(invite) {
    await this.inviteApiService.revokeInvite(invite.id);
    this.fetchOpenInvites();
  }

  public async resendInvite(invite) {
    await this.inviteApiService.resendInvite(invite.id);
  }

  public isNotLoggedInUser(user: IUserResponse): boolean {
    return user.email !== this.sessionService.getCurrentUser().email;
  }
}
