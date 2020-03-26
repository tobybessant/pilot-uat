import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { ICreateAccountRequest } from "src/app/models/api/request/common/create-account.interface";

@Component({
  selector: "app-invited-account-setup",
  templateUrl: "./invited-account-setup.component.html",
  styleUrls: ["./invited-account-setup.component.scss"]
})
export class InvitedAccountSetupComponent implements OnInit {

  public redirectUrl?: string;

  constructor(
    private userApiService: UserApiService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      console.log(params);
      this.redirectUrl = params.get("r");
    });
  }

  public setup() {
  }
}
