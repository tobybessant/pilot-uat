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

  public name: string;
  public email: string;
  public password: string;
  public organisation: string;

  constructor(private supplierAuthService: SupplierAuthService) { }

  submit() {
    this.supplierAuthService.createUser({
      email: this.email,
      password: this.password,
      firstName: this.name
    } as ISupplierCreateAccountRequest);
  }
}
