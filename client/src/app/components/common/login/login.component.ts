import { Component, OnInit, Inject } from "@angular/core";
import { AuthService } from "src/app/services/api/auth/auth-service.service";
import { ISignInRequest } from "src/app/models/api/request/common/sign-in.interface";
import { Router, ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;
  public errors: string[];
  public redirectUrl?: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      console.log(params);
      this.redirectUrl = params.get("r");
    });
  }

  async submit() {
    const response = await this.authService.login({
      email: this.email,
      password: this.password
    } as ISignInRequest);

    if (response.errors.length > 0) {
      this.errors = response.errors;
      return;
    }

    if (this.redirectUrl) {
      this.navigateToRedirect(this.redirectUrl);
      return;
    }

    // NOTE: at this stage the cookie will be set, so
    // navigating to the root will load the account-type-specific
    // routes for the given userType.
    this.router.navigate(["/"]);
  }

  keyDownFunction(event) {
    // capture 'enter' keypress if form is focused
    if (event.keyCode === 13) {
      this.submit();
    }
  }

  private navigateToRedirect(url: string): void {
    this.document.location.href = url;
  }
}
