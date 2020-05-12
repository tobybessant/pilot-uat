import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class StepApiService {

  private readonly baseUrl: string = "/steps";

  constructor(private apiService: ApiService) { }

  public async addStepToCase(description: string, caseId: string): Promise<IApiResponse<IStepResponse>> {
    return this.apiService.post<IStepResponse>(this.baseUrl, {
      description,
      caseId
    });
  }

  public async getStepsforCase<T>(caseId: string): Promise<IApiResponse<T>> {
    return this.apiService.get<T>(`${this.baseUrl}?caseId=${caseId}`);
  }

  public async updateStep(step: IStepResponse): Promise<IApiResponse<IStepResponse>> {
    return this.apiService.patch<IStepResponse>(`${this.baseUrl}/${step.id}`, step);
  }

  public async deleteStepById(id: string): Promise<IApiResponse<void>> {
    return this.apiService.delete(this.baseUrl + "/" + id);
  }
}
