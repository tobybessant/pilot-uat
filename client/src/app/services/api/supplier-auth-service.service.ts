import { Injectable, Inject } from "@angular/core";
import { ApiService } from "./api.service";
import { ISupplierCreateAccountRequest } from "src/app/models/request/supplier/create-account.interface";
import { IApiResponse } from "src/app/models/response/api-response.interface";
import { ISupplierCreateAccountResponse } from "src/app/models/response/supplier/create-account.interface";
import { AuthService } from "./auth-service.service";

@Injectable({
  providedIn: "root"
})
export class SupplierAuthService extends AuthService {

  constructor(@Inject(ApiService) apiService: ApiService) {
    super(apiService);
  }

  public async createUser(user: ISupplierCreateAccountRequest): Promise<IApiResponse<ISupplierCreateAccountResponse>> {
    const response = await this.apiService.post<ISupplierCreateAccountResponse>(this.baseRoute + "/createaccount", user);
    return response;
  }
}
