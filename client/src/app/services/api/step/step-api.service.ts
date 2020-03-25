import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";

@Injectable({
  providedIn: "root"
})
export class StepApiService {

  private readonly baseUrl: string = "/step";

  constructor(private apiService: ApiService) { }

  public async addStepToCase(description: string, caseId: string): Promise<IApiResponse<IStepResponse>> {
    return this.apiService.post<IStepResponse>(this.baseUrl + "/create", {
      description,
      caseId
    });
  }

  public async getStepsforCase(caseId: string): Promise<IApiResponse<IStepResponse[]>> {
    return this.apiService.post<IStepResponse[]>(this.baseUrl + "/all", { caseId });
  }

  public async updateStep(step: IStepResponse): Promise<IApiResponse<IStepResponse>> {
    return this.apiService.post<IStepResponse>(this.baseUrl + "/update", step);
  }

  public async deleteStepById(id: string): Promise<IApiResponse<void>> {
    return this.apiService.delete(this.baseUrl + "/" + id);
  }
}
