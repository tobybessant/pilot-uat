import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ISignInRequest } from "src/app/models/request/unauth/sign-in.interface";
import { ISignInResponse } from "src/app/models/response/uanuth/sign-in.interface";
import { IUserResponse } from "src/app/models/response/user.interface";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  protected readonly baseRoute: string = "/auth";

  constructor(protected apiService: ApiService) { }

  public async login(credentials: ISignInRequest): Promise<ISignInResponse> {
    return await this.apiService.post<ISignInResponse>(this.baseRoute + "/login", credentials);
  }

  public async checkAuth(): Promise<IUserResponse> {
    return await this.apiService.get<IUserResponse>("/user/account");
  }
}
