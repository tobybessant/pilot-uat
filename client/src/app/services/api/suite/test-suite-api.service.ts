import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { ISuiteResponse } from "src/app/models/api/response/supplier/suite.interface";
import { ICreateSuiteRequest } from "src/app/models/api/request/supplier/create-suite.interface";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class TestSuiteApiService {

  protected readonly baseUrl: string = "/suite";

  constructor(private apiService: ApiService) { }

  public async addTestSuite(testSuiteData: ICreateSuiteRequest): Promise<IApiResponse<ISuiteResponse>> {
    const response = await this.apiService.post<ISuiteResponse>(this.baseUrl + "/create", testSuiteData);
    return response;
  }

  public async getTestSuitesForProject(projectId: number): Promise<IApiResponse<ISuiteResponse[]>> {
    const response = await this.apiService.post<ISuiteResponse[]>(this.baseUrl + "/all", { projectId });
    return response;
  }

  public async deleteTestSuiteById(suiteId: string) {
    const response = await this.apiService.delete<void>(this.baseUrl + "/" + suiteId);
    return response;
  }
}
