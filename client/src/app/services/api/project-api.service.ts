import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IProjectResponse } from "../../models/response/supplier/project.interface";
import { ICreateProjectRequest } from "src/app/models/request/common/supplier/create-project.interface";
import { ICreateProjectResponse } from "src/app/models/response/supplier/create-project.interface";

@Injectable({
  providedIn: "root"
})
export class ProjectApiService {

  protected readonly baseUrl: string = "/project";

  constructor(protected apiService: ApiService) { }

  public async getProjects() {
    const response = await this.apiService.get<IProjectResponse[]>(this.baseUrl + "/all");
    return response;
  }

  public async getProjectById(id: string) {
    const response = await this.apiService.post<IProjectResponse>(this.baseUrl, { id });
    return response;
  }

  public async addProject(projectDetails: ICreateProjectRequest) {
    const response = await this.apiService.post<ICreateProjectResponse>(this.baseUrl + "/create", projectDetails);
    return response;
  }

  public async deleteProject(projectId: number) {
    const response = await this.apiService.delete<any>(this.baseUrl + "/" + projectId);
    return response;
  }
}
