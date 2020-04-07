import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
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

  public ready: boolean = false;

  public emailList: string[] = [];

  public readonly separatorKeyCodes: number[] = [9, 32];

  private readonly EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private inviteApiService: InviteApiService,
    private dialogRef: NbDialogRef<any>,
    private toastrService: NbToastrService
  ) { }


  ngOnInit(): void {
    this.ready = true;
  }

  public close() {
    this.dialogRef.close(this.emailList);
  }

  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      if (this.EMAIL_REGEX.test(value)) {
        this.emailList.push(value);
        input.value = "";
      }
    }
  }

  public remove(email: string): void {
    const index = this.emailList.indexOf(email);

    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
  }

  public async sendInvites() {
    const response = await this.inviteApiService.inviteClients(this.emailList, this.projectId);
    if (this.emailList.length > 0 && response.statusCode === 200) {
      this.toastrService.success("Email invites sent successfully", "Client Invites", {
        duration: 5000,
        icon: "checkmark-square-2-outline"
      });
    }
    this.close();
  }
}
