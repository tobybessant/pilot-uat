import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/api/auth-service.service";
import { ICreateAccountRequest } from "src/app/models/request/common/create-account.interface";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"]
})
export class CreateAccountComponent {

  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public organisation: string;

  public errors: string[];
  public accountCreated: boolean = false;

  constructor(private authService: AuthService) { }

  async submit() {
    const createdAccount = await this.authService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    } as ICreateAccountRequest);

    if (createdAccount.errors.length > 0) {
      this.errors = createdAccount.errors;
      return;
    }

    this.accountCreated = true;
  }
}
