import { Component, Inject, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/api/auth/auth-service.service";
import { ICreateAccountRequest } from "src/app/models/api/request/common/create-account.interface";
import { Router } from "@angular/router";
import * as zxcvbn from "zxcvbn";
import {
  NbDialogService,
  NbPopoverDirective,
  NbToastrService,
} from "@nebular/theme";
import { DemoAccountSelectionPromptComponent } from "../demo-account-selection-prompt/demo-account-selection-prompt.component";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
})
export class CreateAccountComponent {
  public firstName: string = "";
  public lastName: string = "";
  public email: string = "";
  public password: string = "";
  public confirmPassword: string = "";
  public organisation: string = "";
  public acceptedTerms: boolean = false;

  public zxcvbnResult: zxcvbn.ZXCVBNResult;
  private readonly ZXCVBN_RESULT_SCORE_FAIL: number = 2;
  public readonly ZXCVBN_RESULT_SCORE_WARNING: number = 3;
  public readonly DEMO_ACCOUNT_SPINNER_NAME: string = "demo_account";

  @ViewChild(NbPopoverDirective) passwordProtocolPopover: NbPopoverDirective;

  public accountCreated: boolean = false;
  public loadingDemoAccount: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toasterService: NbToastrService,
    private dialogService: NbDialogService,
    private spinnerService: NgxSpinnerService
  ) {}

  public showPasswordProtocols(show: boolean): void {
    show
      ? this.passwordProtocolPopover.show()
      : this.passwordProtocolPopover.hide();
  }

  public async submit() {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.organisation ||
      !this.email ||
      !this.password
    ) {
      this.formErrorToast("One or more empty fields");
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.formErrorToast("Passwords do not match");
      return;
    }

    if (
      !this.passwordPassesProtocols() ||
      !this.zxcvbnResult ||
      this.zxcvbnResult.score < this.ZXCVBN_RESULT_SCORE_FAIL
    ) {
      this.formErrorToast("Invalid or insecure password");
      return;
    }

    if (!this.acceptedTerms) {
      this.formErrorToast("You must accept the terms of service");
      return;
    }

    const createdAccount = await this.authService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      organisationName: this.organisation,
      type: "Supplier",
      demoAccount: false,
    } as ICreateAccountRequest);
    console.log(createdAccount);
    if (createdAccount.errors.length > 0 || createdAccount.statusCode !== 201) {
      this.formErrorToast("There was an error creating your account");
      return;
    }

    this.accountCreated = true;
  }

  public goToDashboard() {
    this.router.navigate(["/"]);
  }

  public getPasswordProtocolIcon(valid: boolean): string {
    return valid ? "checkmark-circle-2-outline" : "close-outline";
  }

  public getPasswordProtocolIconColour(valid: boolean): string {
    return valid ? "var(--color-success-500)" : "var(--color-danger-500)";
  }

  public passwordPassesProtocols(): boolean {
    return this.password === this.confirmPassword && this.password.length >= 8;
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
        border: "1px solid red",
      };
    }

    // warning
    return {
      backgroundColor: "#fcf8e4",
      color: "#a27c45",
      border: "1px solid #67512b",
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

  public createDemoAccount(): void {
    this.dialogService
      .open(DemoAccountSelectionPromptComponent)
      .onClose.subscribe(async (accountType) => {
        if (!accountType) {
          return;
        }

        this.spinnerService.show(this.DEMO_ACCOUNT_SPINNER_NAME);
        this.loadingDemoAccount = true;
        console.log("hey");
        const [firstName] = await this.authService.createDemoUser(accountType);
        this.loadingDemoAccount = false;

        this.firstName = firstName;
        this.accountCreated = true;
      });
  }

  private formErrorToast(errorMessage: string): void {
    this.toasterService.danger(errorMessage, "Form Error", {
      icon: "alert-circle-outline",
    });
  }
}
