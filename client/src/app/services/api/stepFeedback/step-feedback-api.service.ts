import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { IStepFeedbackResponse } from "src/app/models/api/response/client/stepFeedback.interface";
import { IResultsMatrixData } from "src/app/models/api/response/supplier/results-matrix.interface";

@Injectable({
  providedIn: "root"
})
export class StepFeedbackApiService {

  private readonly baseUrl: string = "/feedback";

  constructor(private apiService: ApiService) { }

  public async getLatestStepFeedbackFromUser(stepId: string, userEmail: string): Promise<IApiResponse<IStepFeedbackResponse>> {
    return this.apiService.get(`${this.baseUrl}?stepId=${stepId}&userEmail=${userEmail}&onlyLatest=true`);
  }

  public async getAllFeedbackForProject(projectId: string): Promise<IApiResponse<IResultsMatrixData[]>> {
    return await this.apiService.get(`${this.baseUrl}/project?projectId=${projectId}`);
  }

  public async addFeedbackForStep(stepId: string, notes: string, status: string): Promise<IApiResponse<any>> {
    return this.apiService.post(`${this.baseUrl}`, { stepId, notes, status });
  }
}
