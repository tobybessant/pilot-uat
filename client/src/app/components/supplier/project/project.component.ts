import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project-api.service";
import { NbMenuService, NbMenuItem, NbDialogService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { IProjectResponse } from "src/app/models/response/supplier/project.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { SuiteApiService } from "src/app/services/api/suite-api.service";
import { ISuiteResponse } from "src/app/models/response/supplier/suite.interface";

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

  private alive: boolean = true;
  private readonly projectSettingsActions: Map<string, () => void> = new Map<string, () => void>();

  constructor(
    private projectsApiService: ProjectApiService,
    private suiteApiService: SuiteApiService,
    private nbMenuService: NbMenuService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.activeRoute.params.subscribe((urlParameters) => this.fetchProjectById(urlParameters.id));
    this.buildAndLinkSettingsMenu();

    // subscribe to profile menu events
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "project-settings"),
        map(({ item }) => item)
      )
      .subscribe(item => this.projectSettingsActions.get(item.title)());
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.dialogService = null;
    this.projectSettings = null;
  }

  private promptDeleteProject() {
    this.dialogService.open(ConfirmationPromptComponent, {
      hasBackdrop: true,
      autoFocus: false,
      context: {
        bodyText: `You are about to delete this project (${this.project.projectName}).`,
        confirmButtonText: "Delete",
        confirmAction: () => this.deleteProject(this.project.id)
      }
    });
  }

  private async deleteProject(id: number) {
    const response = await this.projectsApiService.deleteProject(id);
    if (response.errors.length === 0) {
      this.project = null;
      this.backToAllProjects();
    }
  }

  private async fetchProjectById(id: string) {
    const response = await this.projectsApiService.getProjectById(id);
    if (response.errors.length === 0) {
      this.project = response.payload;
      this.activeSuite = response.payload.suites[0];
    }
    this.fetchAttemptComplete = true;
    this.spinner.hide();
  }

  public updateActiveSuite($event) {
    this.activeSuite = this.project.suites.filter(suite => suite.id === $event)[0];
  }

  public async fetchSuites() {
    const response = await this.suiteApiService.getSuitesForProject(this.project.id);
    if (response.errors.length > 0) {
      return;
    }
    this.project.suites = response.payload;
  }

  public async addSuiteToProject(suiteName: string) {
    await this.suiteApiService.addSuite({
      suiteName,
      projectId: this.project.id
    });
    await this.fetchSuites();
  }

  public async suiteDeleted(suiteId: number) {
    const deletedIndex = this.project.suites.findIndex(suite => suite.id === suiteId);
    await this.fetchSuites();

    // asume not at the end
    let newSelectedIndex = deletedIndex;

    // if at end, decrement
    if (deletedIndex === this.project.suites.length) {
      newSelectedIndex--;
    }

    this.activeSuite = this.project.suites[newSelectedIndex];
  }

  private buildAndLinkSettingsMenu() {
    // define menu item details and corresponding actions
    const menuItems: (NbMenuItem & { action: () => void})[] = [
      {
        title: "Delete Project",
        icon: "trash-2-outline",
        action: () => { if (this.dialogService) { this.promptDeleteProject(); } },
      }
    ];

    // build settings menu and actions array
    menuItems.forEach(menu => {
      this.projectSettings.push({
        title: menu.title,
        icon: menu.icon
      });

      this.projectSettingsActions.set(menu.title, menu.action);
    });
  }

  public backToAllProjects() {
    // clear dialog service so dialogs do not appear cross-project
    this.dialogService = null;
    this.router.navigate(["/"]);
  }
}
