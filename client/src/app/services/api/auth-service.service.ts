import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IApiResponse } from "src/app/models/response/api-response.interface";
import { ICreateAccountRequest } from "src/app/models/request/common/create-account.interface";
import { ISignInRequest } from "src/app/models/request/common/sign-in.interface";
import { ISignInResponse } from "src/app/models/response/common/sign-in.interface";
import { IUserResponse } from "src/app/models/response/common/user.interface";
import { ICreateAccountResponse } from "src/app/models/response/common/create-account.interface";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  protected readonly baseRoute: string = "/auth";

  constructor(protected apiService: ApiService) { }

  public async createUser(user: ICreateAccountRequest): Promise<IApiResponse<ICreateAccountResponse>> {
    return await this.apiService.post<ICreateAccountResponse>(this.baseRoute + "/createaccount", user);
  }

  public async login(credentials: ISignInRequest): Promise<IApiResponse<ISignInResponse>> {
    return await this.apiService.post<ISignInResponse>(this.baseRoute + "/login", credentials);
  }

  public async checkAuth(): Promise<IApiResponse<IUserResponse>> {
    return await this.apiService.get<IUserResponse>("/user/account");
  }
}
