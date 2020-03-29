import { Component, OnInit } from "@angular/core";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";

@Component({
  selector: "app-projects-grid-client",
  templateUrl: "./projects-grid.component.html",
  styleUrls: ["./projects-grid.component.scss"]
})
export class ProjectsGridComponent implements OnInit {

  public projects: IProjectResponse[];

  constructor(private projectsApiService: ProjectApiService) { }

  async ngOnInit(): Promise<void> {
    await this.getUserProjects();
  }

  private async getUserProjects() {
    const response = await this.projectsApiService.getProjects();
    this.projects = response.payload;
  }
}
