import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/api/auth-service.service";
import { ISignInRequest } from "src/app/models/request/common/sign-in.interface";
import { Router } from "@angular/router";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;
  public errors: string[];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
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

    // NOTE: at this stage the logged in user will be set, so
    // navigating to the root will load the accountType-specific
    //  routes for the given userType.
    this.router.navigate(["/"]);
  }

  keyDownFunction(event) {
    // capture 'enter' keypress if form is focused
    if (event.keyCode === 13) {
      this.submit();
    }
  }
}
