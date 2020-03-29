import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { MatChipInputEvent } from "@angular/material/chips";
import { InviteApiService } from "src/app/services/api/invite/invite-api.service";

@Component({
  selector: "app-invite-user-dialog",
  templateUrl: "./invite-user-dialog.component.html",
  styleUrls: ["./invite-user-dialog.component.scss"]
})
export class InviteUserDialogComponent implements OnInit {

  @Input()
  public projectId: string;

  public emailList: string[] = [];

  public readonly separatorKeysCodes: number[] = [9, 32];

  constructor(
    private inviteApiService: InviteApiService,
    private dialogRef: NbDialogRef<any>
  ) { }


  ngOnInit(): void {
  }

  public close() {
    this.dialogRef.close();
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      this.emailList.push(value);
    }

    if (input) {
      input.value = "";
    }
  }

  public remove(email: string): void {
    const index = this.emailList.indexOf(email);

    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
  }

  public async sendInvites() {
    await this.inviteApiService.inviteClients(this.emailList, this.projectId);
    this.close();
  }

}
