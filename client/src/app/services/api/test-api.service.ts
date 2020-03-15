import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ICreateTestRequest } from "src/app/models/request/supplier/create-test.interface";
import { ITestResponse } from "src/app/models/response/supplier/test.interface";
import { IApiResponse } from "src/app/models/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class TestApiService {

  protected readonly baseUrl: string = "/test";

  constructor(protected apiService: ApiService) { }

  public async addTest(testData: ICreateTestRequest): Promise<IApiResponse<ITestResponse>> {
    const response = await this.apiService.post<ITestResponse>(this.baseUrl + "/create", testData);
    return response;
  }

  public async getTestsForSuite(suiteId: number): Promise<IApiResponse<ITestResponse[]>> {
    const response = await this.apiService.post<ITestResponse[]>(this.baseUrl, { suiteId });
    return response;
  }
}
