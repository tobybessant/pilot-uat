import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project-api.service";
import { NbMenuService, NbMenuItem, NbDialogService } from "@nebular/theme";
import { filter, map, takeWhile } from "rxjs/operators";
import { IProjectResponse } from "src/app/models/response/supplier/project.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { ISuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { SuiteApiService } from "src/app/services/api/suite-api.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit, OnDestroy {

  public project: IProjectResponse;
  public fetchAttemptComplete = false;

  private isAddingSuite: boolean = false;
  public newSuiteName: string = "";
  @ViewChild("suiteNameInput")
  suiteNameInputRef: ElementRef<HTMLInputElement>;

  public projectSettings: NbMenuItem[] = [{ title: "Delete", icon: "trash-2-outline" }];
  private readonly projectSettingsActions: Map<string, () => void> = new Map<string, () => void>();

  public suites: NbMenuItem[] = [];
  public activeSuite: string;

  private alive: boolean = true;

  constructor(
    private projectsApiService: ProjectApiService,
    private suiteApiService: SuiteApiService,
    private nbMenuService: NbMenuService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.projectSettingsActions.set("Delete", () => { if (this.project && this.dialogService) { this.promptDeleteProject(); } });
    this.activeRoute.params.subscribe((urlParameters) => this.setProjectById(urlParameters.id));

    // subscribe to profile menu events
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "project-settings"),
        map(({ item }) => item)
      )
      .subscribe(item => this.projectSettingsActions.get(item.title)());

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "testSuites"),
        map(({ item }) => item)
      )
      .subscribe(item => {
        if (this.alive) {
          this.activeSuite = this.project.suites.filter(s => s.id === item.data.id)[0]?.suiteName;
          console.log(this.activeSuite);
        }
      });
  }

  ngOnDestroy(): void {
    this.dialogService = null;
    this.alive = false;
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

  private async setProjectById(id: string) {
    const response = await this.projectsApiService.getProjectById(id);
    if (response.errors.length === 0) {
      this.project = response.payload;
    }

    this.mapAndAddSuitesToItems(this.project.suites);

    this.fetchAttemptComplete = true;
    this.spinner.hide();
  }

  private mapAndAddSuitesToItems(suites: ISuiteResponse[]) {
    const suiteItems = suites.map(s => ({
      title: s.suiteName,
      data: {
        id: s.id
      }
    }) as NbMenuItem);

    this.suites.push(...suiteItems);
  }

  public getIsAddingSuite(): boolean {
    return this.isAddingSuite;
  }

  public setIsAddingSuite(value: boolean): void {
    if (value === true) {
      setTimeout(() => this.suiteNameInputRef.nativeElement.focus());
      this.newSuiteName = "";
    }

    this.isAddingSuite = value;
  }

  public async addSuite(): Promise<void> {
    if (this.newSuiteName) {
      await this.suiteApiService.addSuite({
        suiteName: this.newSuiteName,
        projectId: this.project.id
      });

      await this.fetchSuites();
      this.newSuiteName = "";
    }
  }

  public async fetchSuites() {
    const response = await this.suiteApiService.getSuitesForProject(this.project.id);

    if (response.errors.length > 0) {
      return;
    }
    this.project.suites = response.payload;
    this.suites = [];
    this.mapAndAddSuitesToItems(response.payload);
  }

  public backToAllProjects() {
    // clear dialog service so dialogs do not appear cross-project
    this.dialogService = null;
    this.router.navigate(["/"]);
  }
}
