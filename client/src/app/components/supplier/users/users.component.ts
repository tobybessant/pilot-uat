import { Component, OnInit, Input } from "@angular/core";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { NbDialogService } from "@nebular/theme";
import { InviteUserDialogComponent } from "../invite-user-dialog/invite-user-dialog.component";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {

  @Input()
  projectId: string;

  projectUsers: IUserResponse[] = [];

  constructor(
    private projectApiService: ProjectApiService,
    private dialogService: NbDialogService
  ) { }

  async ngOnInit(): Promise<void> {
    const response = await this.projectApiService.getUsersForProject(this.projectId);
    this.projectUsers = response.payload;
  }

  public showInviteClientsDialog(): void {
    this.dialogService.open(InviteUserDialogComponent, {
      context: {
        projectId: this.projectId
      }
    });
  }

}
