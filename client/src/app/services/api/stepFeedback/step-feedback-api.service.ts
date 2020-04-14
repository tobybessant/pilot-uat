import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { IApiResponse } from "src/app/models/api/response/api-response.interface";
import { IStepFeedbackResponse } from "src/app/models/api/response/client/stepFeedback.interface";

@Injectable({
  providedIn: "root"
})
export class StepFeedbackApiService {

  private readonly baseUrl: string = "/feedback";

  constructor(private apiService: ApiService) { }

  public getLatestStepFeedbackFromUser(stepId: string, userEmail): Promise<IApiResponse<IStepFeedbackResponse>> {
    return this.apiService.get(`${this.baseUrl}?stepId=${stepId}&userEmail=${userEmail}&onlyLatest=true`);
  }

  public addFeedbackForStep(stepId: string, notes: string, status: string): Promise<IApiResponse<any>> {
    console.log({ stepId, notes, status });
    return this.apiService.post(`${this.baseUrl}`, { stepId, notes, status });
  }
}
