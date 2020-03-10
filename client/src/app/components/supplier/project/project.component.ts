import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProjectApiService } from "src/app/services/api/project-api.service";
import { NbMenuService, NbMenuItem } from "@nebular/theme";
import { filter, map } from "rxjs/operators";
import { IProjectResponse } from "src/app/models/response/common/project.interface";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit, OnDestroy {

  public project: IProjectResponse;
  public projectSettings: NbMenuItem[] = [{ title: "Delete", icon: "trash-2-outline" }];
  private readonly projectSettingsActions: Map<string, () => void> = new Map<string, () => void>();

  constructor(private projectsApiService: ProjectApiService,
              private nbMenuService: NbMenuService,
              private activeRoute: ActivatedRoute,
              private router: Router
  ) {
    this.projectSettingsActions.set("Delete", () => this.deleteProject());

    this.activeRoute.params.subscribe((urlParameters) => {
      this.setProjectById(urlParameters.id);
      // TODO: IF PROJECT IS LAST AND IS DELETED, ERROR THROWN TO CONSOLE...
    });
  }

  ngOnInit(): void {
    // subscribe to profile menu events
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === "project-settings"),
        map(({ item }) => item)
      )
      .subscribe(item => this.projectSettingsActions.get(item.title)());
  }

  ngOnDestroy(): void {
    // reset project state
    this.project = null;
  }

  private async deleteProject() {
    const response = await this.projectsApiService.deleteProject(this.project.id);
    if (response.errors.length === 0) {
      this.router.navigate(["/"]);
    }
  }

  private async setProjectById(id: string) {
    const response = await this.projectsApiService.getProjectById(id);
    if (response.errors.length === 0) {
      this.project = response.payload;
    }
  }

  public backToAllProjects() {
    this.router.navigate(["/"]);
  }
}
