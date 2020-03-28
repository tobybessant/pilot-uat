import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { InviteApiService } from "src/app/services/api/invite/invite-api.service";

@Component({
  selector: "app-invited-account-setup",
  templateUrl: "./invited-account-setup.component.html",
  styleUrls: ["./invited-account-setup.component.scss"]
})
export class InvitedAccountSetupComponent implements OnInit {

  public token?: string;

  public password: string = "";
  public firstName: string = "";
  public lastName: string = "";

  constructor(
    private inviteApiService: InviteApiService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      console.log(params);
      this.token = params.get("t");
    });
  }

  public async setup() {
    await this.inviteApiService.setupAccount({
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      token:  this.token
    });
  }
}
