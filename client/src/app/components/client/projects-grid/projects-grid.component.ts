import { Component, OnInit } from "@angular/core";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { NavbarService } from "src/app/services/navbar/navbar.service";

@Component({
  selector: "app-projects-grid-client",
  templateUrl: "./projects-grid.component.html",
  styleUrls: ["./projects-grid.component.scss"]
})
export class ProjectsGridComponent implements OnInit {

  public projects: IProjectResponse[];

  constructor(private projectsApiService: ProjectApiService, private navbarService: NavbarService) { }

  async ngOnInit(): Promise<void> {
    this.navbarService.resetHeader();
    this.navbarService.setActiveButton(null);
    await this.getUserProjects();
  }

  private async getUserProjects() {
    const response = await this.projectsApiService.getProjects();
    this.projects = response.payload;
  }
}
