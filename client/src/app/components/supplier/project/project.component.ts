import { Component, OnInit } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project-api.service";
import { NbMenuService, NbMenuItem, NbDialogService } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { IProjectResponse } from "src/app/models/response/common/project.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {

  public project: IProjectResponse;
  public fetchAttemptComplete = false;
  public projectSettings: NbMenuItem[] = [{ title: "Delete", icon: "trash-2-outline" }];
  private readonly projectSettingsActions: Map<string, () => void> = new Map<string, () => void>();

  constructor(
    private projectsApiService: ProjectApiService,
    private nbMenuService: NbMenuService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.projectSettingsActions.set("Delete", () => { if (this.project && this.dialogService) { this.promptDeleteProject(); }});
    this.activeRoute.params.subscribe((urlParameters) => this.setProjectById(urlParameters.id));

    // subscribe to profile menu events
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "project-settings"),
        map(({ item }) => item)
      )
      .subscribe(item => this.projectSettingsActions.get(item.title)());
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
    this.fetchAttemptComplete = true;
    this.spinner.hide();
  }

  public backToAllProjects() {
    // clear dialog service so dialogs do not appear cross-project
    this.dialogService = null;
    this.router.navigate(["/"]);
  }
}
