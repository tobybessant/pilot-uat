import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { ISuiteResponse } from "src/app/models/api/response/supplier/suite.interface";
import { ICreateSuiteRequest } from "src/app/models/api/request/supplier/create-suite.interface";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class TestSuiteApiService {

  protected readonly baseUrl: string = "/suites";

  constructor(private apiService: ApiService) { }

  public async addTestSuite(testSuiteData: ICreateSuiteRequest): Promise<IApiResponse<ISuiteResponse>> {
    const response = await this.apiService.post<ISuiteResponse>(this.baseUrl, testSuiteData);
    return response;
  }

  public async getTestSuitesForProject(projectId: string): Promise<IApiResponse<ISuiteResponse[]>> {
    const response = await this.apiService.get<ISuiteResponse[]>(`${this.baseUrl}?projectId=${projectId}`);
    return response;
  }

  public async deleteTestSuiteById(projectId: string, suiteId: string) {
    const response = await this.apiService.delete<void>(this.baseUrl + "/" + suiteId);
    return response;
  }
}
