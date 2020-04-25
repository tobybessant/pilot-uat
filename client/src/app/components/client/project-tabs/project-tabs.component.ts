import { Component, OnInit, Input } from "@angular/core";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";
import { TestSuiteApiService } from "src/app/services/api/suite/test-suite-api.service";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { ActiveTestSuiteService } from "src/app/services/active-suite/active-test-suite.service";
import { ActiveProjectService } from "src/app/services/active-project/active-project.service";

@Component({
  selector: "app-project-tabs",
  templateUrl: "./project-tabs.component.html",
  styleUrls: ["./project-tabs.component.scss"]
})
export class ProjectTabsComponent implements OnInit {

  public project: IProjectResponse;
  public activeSuite: ISuiteResponse;

  constructor(
    private activeProjectService: ActiveProjectService,
    private activeTestSuiteService: ActiveTestSuiteService
  ) { }

  ngOnInit(): void {
    this.activeProjectService.$.subscribe(project => this.setProject(project));

    if (!this.project) {
      this.setProject(this.activeProjectService.getActiveProject());
    }
  }

  private setProject(project: IProjectResponse): void {
    this.project = project;
    this.setActiveSuite(this.project.suites[0]);
  }

  public updateActiveSuite($event) {
    this.setActiveSuite(this.project.suites.filter(suite => suite.id === $event)[0]);
  }

  private setActiveSuite(suite: ISuiteResponse) {
    this.activeTestSuiteService.setSuite(suite);
  }
}
