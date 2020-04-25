import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { TestSuiteApiService } from "src/app/services/api/suite/test-suite-api.service";
import { ActiveTestSuiteService } from "src/app/services/active-suite/active-test-suite.service";
import { ActivatedRoute } from "@angular/router";
import { NavbarService } from "src/app/services/navbar/navbar.service";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { IProjectResponse } from "src/app/models/api/response/client/project.interface";
import { ActiveProjectService } from "src/app/services/active-project/active-project.service";

@Component({
  selector: "app-project-client",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ClientProjectComponent implements OnInit, OnDestroy {

  public fetchAttemptComplete = false;
  public activeSuite: ISuiteResponse;

  constructor(
    private projectsApiService: ProjectApiService,
    private activeRoute: ActivatedRoute,
    private navbarService: NavbarService,
    private activeProjectService: ActiveProjectService
  ) { }

  ngOnInit(): void {
    this.navbarService.setIsViewingProject(true);
    this.activeRoute.params.subscribe(async (urlParameters) => await this.fetchProjectById(urlParameters.id));
  }

  ngOnDestroy(): void {
  }

  private async fetchProjectById(id: string) {
    const response = await this.projectsApiService.getProjectById(id);
    if (response.errors.length === 0) {
      this.activeProjectService.setActiveProject(response.payload);
      this.navbarService.setHeader(response.payload.title);
    }
    this.fetchAttemptComplete = true;
  }

  public getActiveProject(): IProjectResponse {
    return this.activeProjectService.getActiveProject();
  }
}
