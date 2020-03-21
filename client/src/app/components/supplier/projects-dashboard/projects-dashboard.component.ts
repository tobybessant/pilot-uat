import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project-api.service";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";
import { ICreateProjectResponse } from "src/app/models/api/response/supplier/create-project.interface";

@Component({
  selector: "app-projects-dashboard",
  templateUrl: "./projects-dashboard.component.html",
  styleUrls: ["./projects-dashboard.component.scss"]
})
export class ProjectsDashboardComponent implements OnInit {

  public projects: IProjectResponse[];
  public newProjectName: string = "";
  private isAddingProject: boolean = false;

  @ViewChild("projectNameInput")
  projectNameInputRef: ElementRef<HTMLInputElement>;

  constructor(private projectsApiService: ProjectApiService) { }

  async ngOnInit(): Promise<void> {
    await this.getUserProjects();
  }

  public setIsAddingProject(flag: boolean) {
    if (flag === true) {
      setTimeout(() => this.projectNameInputRef.nativeElement.focus());
      this.newProjectName = "";
    }

    this.isAddingProject = flag;
  }

  public getIsAddingProject() {
    return this.isAddingProject;
  }

  private async getUserProjects() {
    const response = await this.projectsApiService.getProjects();
    this.projects = response.payload;
  }

  public async addProject() {
    const response = await this.projectsApiService.addProject({
      title: this.newProjectName
    });
    this.newProjectName = "";
    await this.getUserProjects();
  }
}
