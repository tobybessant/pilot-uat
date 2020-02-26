import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ISupplierCreateAccountRequest } from "src/app/models/request/supplier/create-account.interface";
import { IApiResponse } from "src/app/models/response/api-response.interface";
import { ISupplierCreateAccountResponse } from "src/app/models/response/supplier/create-account.interface";

@Injectable({
  providedIn: "root"
})
export class SupplierAuthService {

  private readonly baseRoute: string = "/auth";

  constructor(private apiService: ApiService) { }

  public async createUser(user: ISupplierCreateAccountRequest): Promise<IApiResponse<ISupplierCreateAccountResponse>> {
    console.log("sending request to create supplier account");

    const response = await this.apiService.post<IApiResponse<ISupplierCreateAccountResponse>>(this.baseRoute + "/createaccount", {
      email: user.email,
      password: user.password,
      firstName: user.firstName
    });

    return response;
  }
}
