import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IProjectResponse } from "../../models/response/common/project.interface";
import { ICreateProjectRequest } from "src/app/models/request/common/supplier/create-project.interface";
import { ICreateProjectResponse } from "src/app/models/response/supplier/create-project.interface";

@Injectable({
  providedIn: "root"
})
export class ProjectApiService {

  protected readonly baseUrl: string = "/project";

  constructor(protected apiService: ApiService) { }

  public async getProjects() {
    const response = await this.apiService.get<IProjectResponse[]>(this.baseUrl);
    return response;
  }

  public async addProject(projectDetails: ICreateProjectRequest) {
    const response = await this.apiService.post<ICreateProjectResponse>(this.baseUrl, projectDetails);
    return response;
  }
}
