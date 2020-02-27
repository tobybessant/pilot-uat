import { Component, OnInit } from "@angular/core";
import { SupplierAuthService } from "src/app/services/api/supplier-auth-service.service";
import { ISupplierCreateAccountRequest } from "src/app/models/request/supplier/create-account.interface";
import { ThrowStmt } from "@angular/compiler";

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

  public accountCreated: boolean = false;

  constructor(private supplierAuthService: SupplierAuthService) { }

  async submit() {
    console.log(this.lastName);
    const createdAccount = await this.supplierAuthService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    } as ISupplierCreateAccountRequest);

    if (createdAccount.errors.length > 0) {
      console.log(createdAccount.errors);
      return;
    }

    this.accountCreated = true;
  }
}
