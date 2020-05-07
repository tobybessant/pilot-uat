import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { InviteApiService } from "src/app/services/api/invite/invite-api.service";
import { NbPopoverDirective, NbToastrService } from "@nebular/theme";
import * as zxcvbn from "zxcvbn";

@Component({
  selector: "app-invited-account-setup",
  templateUrl: "./invited-account-setup.component.html",
  styleUrls: ["./invited-account-setup.component.scss"]
})
export class InvitedAccountSetupComponent implements OnInit {

  public token?: string;

  public password: string = "";
  public confirmPassword: string = "";
  public firstName: string = "";
  public lastName: string = "";

  public zxcvbnResult: zxcvbn.ZXCVBNResult;
  private readonly ZXCVBN_RESULT_SCORE_FAIL: number = 2;
  public readonly ZXCVBN_RESULT_SCORE_WARNING: number = 3;

  @ViewChild(NbPopoverDirective) passwordProtocolPopover: NbPopoverDirective;

  constructor(
    private inviteApiService: InviteApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterService: NbToastrService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.token = params.get("t");
    });
  }

  public async setup() {
    if (!this.firstName || !this.lastName || !this.password) {
      this.toasterService.danger("One or more empty fields.", "Error", {
        icon: "alert-circle-outline",
        hasIcon: false
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toasterService.danger("Passwords do not match", "Error", {
        icon: "alert-circle-outline",
        hasIcon: false
      });
      return;
    }

    if (
      !this.passwordPassesProtocols()
      || !this.zxcvbnResult
      || this.zxcvbnResult.score < this.ZXCVBN_RESULT_SCORE_FAIL
    ) {
      this.toasterService.danger("Invalid or insecure password.", "Error", {
        icon: "alert-circle-outline",
        hasIcon: false
      });
      return;
    }

    const response = await this.inviteApiService.setupAccount({
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      token: this.token
    });

    if (response.errors.length === 0) {
      setTimeout(() => this.router.navigate(["/"]), 500);
    }
  }

  public getPasswordProtocolIcon(valid: boolean): string {
    return valid ? "checkmark-circle-2-outline" : "close-outline";
  }

  public getPasswordProtocolIconColour(valid: boolean): string {
    return valid ? "var(--color-success-500)" : "var(--color-danger-500)";
  }

  public passwordPassesProtocols(): boolean {
    return this.password === this.confirmPassword
      && this.password.length >= 8;
  }

  public showPasswordProtocols(show: boolean): void {
    show ?
      this.passwordProtocolPopover.show() :
      this.passwordProtocolPopover.hide();
  }

  public zxcvbnCheck(): boolean {
    if (this.passwordPassesProtocols()) {
      this.zxcvbnResult = zxcvbn(this.password);
      return true;
    }
    return false;
  }


  public getZxcvbnCheckResult(): zxcvbn.ZXCVBNResult {
    return this.zxcvbnResult;
  }

  public getZxcvbnCheckStyle(): any {
    if (this.zxcvbnResult.score < this.ZXCVBN_RESULT_SCORE_FAIL) {
      // red alert
      return {
        backgroundColor: "var(--color-danger-100)",
        color: "red",
        border: "1px solid red"
      };
    }

    // warning
    return {
      backgroundColor: "#fcf8e4",
      color: "#a27c45",
      border: "1px solid #67512b"
    };
  }

  public getZxcvbnCheckText(): string {
    if (this.zxcvbnResult.score < this.ZXCVBN_RESULT_SCORE_FAIL) {
      return "This password is too weak. Please enter a stronger password.";
    }

    return "You will be able to proceed with this password - but it is weak. Please consider using a stronger password.";
  }

  public getZxcvbnCheckIcon(): string {
    if (this.zxcvbnResult.score < this.ZXCVBN_RESULT_SCORE_FAIL) {
      return "shield-off-outline";
    }

    return "alert-triangle-outline";
  }

}
