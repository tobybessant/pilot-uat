import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/api/auth/auth-service.service";
import { ICreateAccountRequest } from "src/app/models/api/request/common/create-account.interface";
import { Router } from "@angular/router";

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

  constructor(private authService: AuthService, private router: Router) { }

  public async submit() {
    const createdAccount = await this.authService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      organisationName: this.organisation,
      type: "Supplier"
    } as ICreateAccountRequest);

    if (createdAccount.errors.length > 0) {
      this.errors = createdAccount.errors;
      return;
    }

    this.accountCreated = true;
  }

  public goToDashboard() {
    this.router.navigate(["/"]);
  }
}
