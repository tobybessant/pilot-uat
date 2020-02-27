import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/api/auth-service.service";
import { ISignInRequest } from "src/app/models/request/unauth/sign-in.interface";

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

  submit() {
    const response = this.authService.login({
      email: this.email,
      password: this.password
    } as ISignInRequest);
  }
}
