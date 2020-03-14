import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ITestSuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { ICreateTestSuiteRequest } from "src/app/models/request/common/supplier/create-suite.interface";
import { IApiResponse } from "src/app/models/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class TestSuiteApiService {

  protected readonly baseUrl: string = "/suite";

  constructor(private apiService: ApiService) { }

  public async addTestSuite(testSuiteData: ICreateTestSuiteRequest): Promise<IApiResponse<ITestSuiteResponse>> {
    const response = await this.apiService.post<ITestSuiteResponse>(this.baseUrl + "/create", testSuiteData);
    return response;
  }

  public async getTestSuitesForProject(projectId: number): Promise<IApiResponse<ITestSuiteResponse[]>> {
    const response = await this.apiService.post<ITestSuiteResponse[]>(this.baseUrl + "/all", { projectId });
    return response;
  }

  public async deleteTestSuiteById(suiteId: number) {
    const response = await this.apiService.delete<void>(this.baseUrl + "/" + suiteId);
    return response;
  }
}
