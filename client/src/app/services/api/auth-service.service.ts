import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IApiResponse } from "src/app/models/response/api-response.interface";
import { ICreateAccountRequest } from "src/app/models/request/common/create-account.interface";
import { ISignInRequest } from "src/app/models/request/common/sign-in.interface";
import { ISignInResponse } from "src/app/models/response/common/sign-in.interface";
import { IUserResponse } from "src/app/models/response/common/user.interface";
import { ICreateAccountResponse } from "src/app/models/response/common/create-account.interface";
import { Observable, BehaviorSubject } from "rxjs";
import { UserApiService } from "./user-api.service";
import { SessionService } from "../session.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  protected readonly baseRoute: string = "/auth";

  private currentUserSubject: BehaviorSubject<IUserResponse>;
  public currentUser: Observable<IUserResponse>;

  constructor(
    protected apiService: ApiService,
    protected sessionService: SessionService
    ) { }

  public async createUser(user: ICreateAccountRequest): Promise<IApiResponse<ICreateAccountResponse>> {
    const response =  await this.apiService.post<ICreateAccountResponse>(this.baseRoute + "/createaccount", user);

    // if user successfully created account then log them in
    if (response !== undefined) {
      await this.sessionService.setLoggedInUserFromSession();
    }

    return response;
  }

  public async login(credentials: ISignInRequest): Promise<IApiResponse<ISignInResponse>> {
    const response = await this.apiService.post<ISignInResponse>(this.baseRoute + "/login", credentials);

    // if user successfully logged in
    if (response !== undefined) {
      await this.sessionService.setLoggedInUserFromSession();
    }

    return response;
  }
}
