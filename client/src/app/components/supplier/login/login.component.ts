import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/api/auth-service.service";
import { ISignInRequest } from "src/app/models/request/common/sign-in.interface";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async submit() {
    const response = await this.authService.login({
      email: this.email,
      password: this.password
    } as ISignInRequest);

    console.log("login: ", response);

    const authCheck = await this.authService.checkAuth();
    console.log(authCheck);
  }
}
