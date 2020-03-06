import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IProjectResponse } from "../../models/response/common/project.interface";

@Injectable({
  providedIn: "root"
})
export class ProjectApiService {

  protected readonly baseUrl: string = "/project";

  constructor(protected apiService: ApiService) { }

  public async getProjects() {
    const response = await this.apiService.get<IProjectResponse[]>(this.baseUrl);
    console.log(response);
    return response;
  }
}
