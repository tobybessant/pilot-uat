import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IApiResponse } from "src/app/models/response/api-response.interface";
import { ICreateAccountRequest } from "src/app/models/request/common/create-account.interface";
import { ISignInRequest } from "src/app/models/request/common/sign-in.interface";
import { ISignInResponse } from "src/app/models/response/common/sign-in.interface";
import { IUserResponse } from "src/app/models/response/common/user.interface";
import { ICreateAccountResponse } from "src/app/models/response/common/create-account.interface";
import { Observable, BehaviorSubject } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  protected readonly baseRoute: string = "/auth";

  private currentUserSubject: BehaviorSubject<IUserResponse>;
  public currentUser: Observable<IUserResponse>;

  constructor(
    protected apiService: ApiService,
    protected userService: UserService
    ) {  }

  public async createUser(user: ICreateAccountRequest): Promise<IApiResponse<ICreateAccountResponse>> {
    return await this.apiService.post<ICreateAccountResponse>(this.baseRoute + "/createaccount", user);
  }

  public async login(credentials: ISignInRequest): Promise<IApiResponse<ISignInResponse>> {
    const response =  await this.apiService.post<ISignInResponse>(this.baseRoute + "/login", credentials);

    // if user successfully logged in
    if (response !== undefined) {
      this.setUser();
    }

    return response;
  }

  private async setUser() {
    const response = await this.userService.getAccountDetails();

    this.currentUserSubject = new BehaviorSubject<IUserResponse>(response.payload);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getCurrentUser(): IUserResponse | undefined {
      return this.currentUserSubject?.value;
  }
}
