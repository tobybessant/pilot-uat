import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { IProjectResponse } from "../../../models/api/response/supplier/project.interface";
import { ICreateProjectRequest } from "src/app/models/api/request/supplier/create-project.interface";
import { ICreateProjectResponse } from "src/app/models/api/response/supplier/create-project.interface";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";

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

  public async deleteProject(projectId: string) {
    const response = await this.apiService.delete<void>(this.baseUrl + "/" + projectId);
    return response;
  }

  public async getUsersForProject(projectId: string) {
    const response = await this.apiService.get<IUserResponse[]>(`${this.baseUrl}/${projectId}/users`);
    return response;
  }

  public async getProjectOpenInvites(projectId: string) {
    const response = await this.apiService.get<any[]>(`${this.baseUrl}/${projectId}/invites`);
    return response;
  }
}
