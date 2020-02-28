import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IApiResponse } from "src/app/models/response/api-response.interface";
import { IUserResponse } from "src/app/models/response/common/user.interface";

@Injectable({
  providedIn: "root"
})
export class UserService {

  private baseUrl: string = "/user";

  constructor(private apiService: ApiService) { }

  public async getAccountDetails(): Promise<IApiResponse<IUserResponse>> {
      const response = await this.apiService.get<IUserResponse>(this.baseUrl + "/account");
      return response;
  }
}
