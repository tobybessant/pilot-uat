import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { TestSuiteApiService } from "src/app/services/api/suite/test-suite-api.service";
import { ActiveTestSuiteService } from "src/app/services/active-suite/active-test-suite.service";
import { ActivatedRoute } from "@angular/router";
import { NavbarService } from "src/app/services/navbar/navbar.service";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { IProjectResponse } from "src/app/models/api/response/client/project.interface";

@Component({
  selector: "app-project-client",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ClientProjectComponent implements OnInit, OnDestroy {

  public project: IProjectResponse;
  public fetchAttemptComplete = false;
  public activeSuite: ISuiteResponse;

  constructor(
    private projectsApiService: ProjectApiService,
    private testSuiteApiService: TestSuiteApiService,
    private activeTestSuiteService: ActiveTestSuiteService,
    private activeRoute: ActivatedRoute,
    private navbarService: NavbarService
  ) { }

  ngOnInit(): void {
    this.navbarService.setIsViewingProject(true);
    this.activeRoute.params.subscribe((urlParameters) => this.fetchProjectById(urlParameters.id));
  }

  ngOnDestroy(): void {
    this.navbarService.clearHeader();
    this.navbarService.setIsViewingProject(false);
  }

  private async fetchProjectById(id: string) {
    const response = await this.projectsApiService.getProjectById(id);
    if (response.errors.length === 0) {
      this.project = response.payload;
      this.setActiveSuite(response.payload.suites[0]);
    }
    this.navbarService.setHeader(response.payload.title);
    this.fetchAttemptComplete = true;
  }

  public updateActiveSuite($event) {
    this.setActiveSuite(this.project.suites.filter(suite => suite.id === $event)[0]);
  }

  public async fetchSuites() {
    const response = await this.testSuiteApiService.getTestSuitesForProject(this.project.id);
    if (response.errors.length > 0) {
      return;
    }
    this.project.suites = response.payload;
  }

  private setActiveSuite(suite: ISuiteResponse) {
    this.activeTestSuiteService.setSuite(suite);
  }

}
