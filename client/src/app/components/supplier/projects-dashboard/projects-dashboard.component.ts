import { Component, OnInit } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project-api.service";
import { IProjectResponse } from "src/app/models/response/common/project.interface";

@Component({
  selector: "app-projects-dashboard",
  templateUrl: "./projects-dashboard.component.html",
  styleUrls: ["./projects-dashboard.component.scss"]
})
export class ProjectsDashboardComponent implements OnInit {

  public projects: IProjectResponse[];

  constructor(private projectsApiService: ProjectApiService) { }

  async ngOnInit(): Promise<void> {
    const response = await this.projectsApiService.getProjects();
    this.projects = response.payload;
  }

}
