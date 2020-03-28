import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { ICreateAccountRequest } from "src/app/models/api/request/common/create-account.interface";
import { ISignInRequest } from "src/app/models/api/request/common/sign-in.interface";
import { ISignInResponse } from "src/app/models/api/response/common/sign-in.interface";
import { ICreateAccountResponse } from "src/app/models/api/response/common/create-account.interface";
import { SessionService } from "../../session/session.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  protected readonly baseUrl: string = "/auth";

  constructor(
    protected apiService: ApiService,
    protected sessionService: SessionService
    ) { }

  public async createUser(user: ICreateAccountRequest): Promise<IApiResponse<ICreateAccountResponse>> {
    const response =  await this.apiService.post<ICreateAccountResponse>(this.baseUrl + "/createaccount", user);

    // if user successfully created account then log them in
    if (response.errors.length === 0) {
      await this.sessionService.setUser();
    }

    return response;
  }

  public async login(credentials: ISignInRequest): Promise<IApiResponse<ISignInResponse>> {
    const response = await this.apiService.post<ISignInResponse>(this.baseUrl + "/login", credentials);

    // if user successfully logged in
    if (response !== undefined) {
      await this.sessionService.setUser();
    }

    return response;
  }

  public async logout(): Promise<void> {
    await this.apiService.get<void>(this.baseUrl + "/logout");
    this.sessionService.logout();
  }
}
