import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { Router } from "@angular/router";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";

@Component({
  selector: "app-project-settings",
  templateUrl: "./project-settings.component.html",
  styleUrls: ["./project-settings.component.scss"]
})
export class ProjectSettingsComponent implements OnInit, OnDestroy {

  @Input()
  public project: IProjectResponse;

  constructor(
    private projectsApiService: ProjectApiService,
    private dialogService: NbDialogService,
    private router: Router
  ) { }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.dialogService = null;
  }

  public promptDeleteProject() {
    if (this.dialogService) {
      this.dialogService.open(ConfirmationPromptComponent, {
        hasBackdrop: true,
        autoFocus: false,
        context: {
          bodyText: `You are about to delete this project (${this.project.title}).`,
          confirmButtonText: "Delete",
          confirmAction: () => this.deleteProject(this.project.id)
        }
      });
    }
  }

  private async deleteProject(id: number) {
    const response = await this.projectsApiService.deleteProject(id);
    if (response.errors.length === 0) {
      this.backToAllProjects();
    }
  }

  public backToAllProjects() {
    // clear dialog service so dialogs do not appear cross-project
    this.dialogService = null;
    this.router.navigate(["/"]);
  }
}
