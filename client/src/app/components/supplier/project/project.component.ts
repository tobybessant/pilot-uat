import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { NbMenuService, NbMenuItem, NbDialogService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { TestSuiteApiService } from "src/app/services/api/suite/test-suite-api.service";
import { ISuiteResponse } from "src/app/models/api/response/supplier/suite.interface";
import { ActiveTestSuiteService } from "src/app/services/active-suite/active-test-suite.service";
import { NavbarService } from "src/app/services/navbar/navbar.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit, OnDestroy {

  public project: IProjectResponse;
  public fetchAttemptComplete = false;
  public activeSuite: ISuiteResponse;
  public projectSettings: NbMenuItem[] = [];

  constructor(
    private projectsApiService: ProjectApiService,
    private testSuiteApiService: TestSuiteApiService,
    private activeTestSuiteService: ActiveTestSuiteService,
    private nbMenuService: NbMenuService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dialogService: NbDialogService,
    private navbarService: NavbarService
  ) { }

  ngOnInit(): void {
    this.navbarService.setIsViewingProject(true);
    this.activeRoute.params.subscribe((urlParameters) => this.fetchProjectById(urlParameters.id));
  }

  ngOnDestroy(): void {
    this.dialogService = null;
    this.projectSettings = null;
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

  public async addSuiteToProject(suiteName: string) {
    await this.testSuiteApiService.addTestSuite({
      title: suiteName,
      projectId: this.project.id
    });
    await this.fetchSuites();
  }

  public async suiteDeleted(suiteId: string) {
    const deletedIndex = this.project.suites.findIndex(suite => suite.id === suiteId);
    await this.fetchSuites();

    // asume not at the end
    let newSelectedIndex = deletedIndex;

    // if at end, decrement
    if (deletedIndex === this.project.suites.length) {
      newSelectedIndex--;
    }

    this.setActiveSuite(this.project.suites[newSelectedIndex]);
  }

  private setActiveSuite(suite: ISuiteResponse) {
    this.activeTestSuiteService.setSuite(suite);
  }
}
