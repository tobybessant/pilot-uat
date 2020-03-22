import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { ICreateCaseRequest } from "src/app/models/api/request/supplier/create-test.interface";
import { ICaseResponse } from "src/app/models/api/response/supplier/test.interface";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class CaseApiService {

  protected readonly baseUrl: string = "/case";

  constructor(protected apiService: ApiService) { }

  public async addTest(testData: ICreateCaseRequest): Promise<IApiResponse<ICaseResponse>> {
    const response = await this.apiService.post<ICaseResponse>(this.baseUrl + "/create", testData);
    return response;
  }

  public async updateTest(testData: ICaseResponse) {
    const response = await this.apiService.post<ICaseResponse>(this.baseUrl + "/update", testData);
    return response;
  }

  public async getTestsForSuite(suiteId: number): Promise<IApiResponse<ICaseResponse[]>> {
    const response = await this.apiService.post<ICaseResponse[]>(this.baseUrl, { suiteId });
    return response;
  }

  public async deleteTestById(testId: number): Promise<IApiResponse<ICaseResponse>> {
    const response = await this.apiService.delete<ICaseResponse>(this.baseUrl + "/" + testId);
    return response;
  }
}
