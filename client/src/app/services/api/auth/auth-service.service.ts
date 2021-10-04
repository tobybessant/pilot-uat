import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { ICreateAccountRequest } from "src/app/models/api/request/common/create-account.interface";
import { ISignInRequest } from "src/app/models/api/request/common/sign-in.interface";
import { ISignInResponse } from "src/app/models/api/response/common/sign-in.interface";
import { ICreateAccountResponse } from "src/app/models/api/response/common/create-account.interface";
import { SessionService } from "../../session/session.service";
import { ICreateDemoAccountsResponse } from "src/app/models/api/response/common/create-demo-accounts.interface";
import { LocalStorageService } from "../../local-storage/local-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  protected readonly baseUrl: string = "/auth";

  constructor(
    protected apiService: ApiService,
    protected sessionService: SessionService,
    protected localStorage: LocalStorageService
  ) {}

  public async createUser(
    user: ICreateAccountRequest
  ): Promise<IApiResponse<ICreateAccountResponse>> {
    const response = await this.apiService.post<ICreateAccountResponse>(
      this.baseUrl + "/createaccount",
      user
    );

    // if user successfully created account then log them in
    if (response.errors.length === 0) {
      await this.sessionService.setUser();
    }

    return response;
  }

  public async createDemoUser(
    accountType: string
  ): Promise<[string, IApiResponse<ISignInResponse>]> {
    const response = await this.apiService.post<ICreateDemoAccountsResponse>(
      "/demoaccount/initialise"
    );

    const { client, supplier } = response.payload;
    const clientCredentials = {
      email: client.email,
      password: client.password,
    };
    const supplierCredentials = {
      email: supplier.email,
      password: supplier.password,
    };

    this.localStorage.set("demo_account", {
      client: clientCredentials,
      supplier: supplierCredentials,
    });

    await setTimeout(() => {}, 5000);

    if (accountType === "Supplier") {
      return [supplier.firstName, await this.login(supplierCredentials)];
    } else {
      return [client.firstName, await this.login(clientCredentials)];
    }
  }

  public async login(
    credentials: ISignInRequest
  ): Promise<IApiResponse<ISignInResponse>> {
    const response = await this.apiService.post<ISignInResponse>(
      this.baseUrl + "/login",
      credentials
    );

    // if user successfully logged in
    if (response !== undefined) {
      await this.sessionService.setUser();
    }

    return response;
  }

  public async logout(skipRedirect: boolean = false): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.apiService.get<void>(
        `${this.baseUrl}/logout?skipRedirect=${skipRedirect}`
      );
      this.sessionService.logout();
      resolve();
    });
  }
}
