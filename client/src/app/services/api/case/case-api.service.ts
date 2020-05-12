import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { ICreateCaseRequest } from "src/app/models/api/request/supplier/create-test.interface";
import { ICaseResponse } from "src/app/models/api/response/supplier/case.interface";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class CaseApiService {

  protected readonly baseUrl: string = "/cases";

  constructor(protected apiService: ApiService) { }

  public async addCase(testData: ICreateCaseRequest): Promise<IApiResponse<ICaseResponse>> {
    const response = await this.apiService.post<ICaseResponse>(this.baseUrl, testData);
    return response;
  }

  public async updateCase(testData: ICaseResponse) {
    const response = await this.apiService.patch<ICaseResponse>(`${this.baseUrl}/${testData.id}`, testData);
    return response;
  }

  public async getCasesForSuite<T>(suiteId: string): Promise<IApiResponse<T>> {
    const response = await this.apiService.get<T>(`${this.baseUrl}?suiteId=${suiteId}`);
    return response;
  }

  public async deleteCaseById(caseId: string): Promise<IApiResponse<ICaseResponse>> {
    const response = await this.apiService.delete<ICaseResponse>(this.baseUrl + "/" + caseId);
    return response;
  }

  public async getCaseById<T>(caseId): Promise<IApiResponse<T>> {
    const response = await this.apiService.get<T>(this.baseUrl + "/" + caseId);
    return response;
  }
}
