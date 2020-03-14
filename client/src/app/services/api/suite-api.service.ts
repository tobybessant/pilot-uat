import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ISuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { ICreateSuiteRequest } from "src/app/models/request/common/supplier/create-suite.interface";
import { IApiResponse } from "src/app/models/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class SuiteApiService {

  protected readonly baseUrl: string = "/suite";

  constructor(private apiService: ApiService) { }

  public async addSuite(suiteData: ICreateSuiteRequest): Promise<IApiResponse<ISuiteResponse>> {
    const response = await this.apiService.post<ISuiteResponse>(this.baseUrl + "/create", suiteData);
    return response;
  }

  public async getSuitesForProject(projectId: number): Promise<IApiResponse<ISuiteResponse[]>> {
    const response = await this.apiService.post<ISuiteResponse[]>(this.baseUrl + "/all", { projectId });
    return response;
  }

  public async deleteSuiteById(suiteId: number) {
    const response = await this.apiService.delete<void>(this.baseUrl + "/" + suiteId);
    return response;
  }
}
