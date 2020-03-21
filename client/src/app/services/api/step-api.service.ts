import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class StepApiService {

  private readonly baseUrl: string = "/step";

  constructor(private apiService: ApiService) { }

  public async addStepToCase(description: string, caseId: string) {
    return this.apiService.post<any>(this.baseUrl, {
      description,
      caseId
     });
  }

  public async getStepsforCase(caseId: number) {
    console.log(caseId);
    return this.apiService.post<any>(this.baseUrl + "/all", { caseId });
  }
}
