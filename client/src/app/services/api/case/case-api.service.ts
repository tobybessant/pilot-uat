import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { ICreateCaseRequest } from "src/app/models/api/request/supplier/create-test.interface";
import { ICaseResponse } from "src/app/models/api/response/supplier/case.interface";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class CaseApiService {

  protected readonly baseUrl: string = "/case";

  constructor(protected apiService: ApiService) { }

  public async addCase(testData: ICreateCaseRequest): Promise<IApiResponse<ICaseResponse>> {
    const response = await this.apiService.post<ICaseResponse>(this.baseUrl + "/create", testData);
    return response;
  }

  public async updateCase(testData: ICaseResponse) {
    const response = await this.apiService.post<ICaseResponse>(this.baseUrl + "/update", testData);
    return response;
  }

  public async getCasesForSuite(suiteId: string): Promise<IApiResponse<ICaseResponse[]>> {
    const response = await this.apiService.post<ICaseResponse[]>(this.baseUrl, { suiteId });
    return response;
  }

  public async deleteCaseById(testId: string): Promise<IApiResponse<ICaseResponse>> {
    const response = await this.apiService.delete<ICaseResponse>(this.baseUrl + "/" + testId);
    return response;
  }
}
