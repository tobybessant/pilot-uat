import { Component, OnInit, OnDestroy } from "@angular/core";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { ActiveProjectService } from "src/app/services/active-project/active-project.service";
import { NavbarService } from "src/app/services/navbar/navbar.service";
import { BasicNavButtonComponent } from "../../common/nav/basic-nav-button/basic-nav-button.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";

@Component({
  selector: "app-project-tabs",
  templateUrl: "./project-tabs.component.html",
  styleUrls: ["./project-tabs.component.scss"]
})
export class ProjectTabsComponent implements OnInit, OnDestroy {

  public project: IProjectResponse;

  public activeSuite: ISuiteResponse;

  constructor(
    private router: Router,
    private navBarService: NavbarService,
    private activeRoute: ActivatedRoute,
    private projectApiService: ProjectApiService,
    private navbarService: NavbarService
  ) { }

  ngOnDestroy(): void {
    console.log("Destroying project-tabs");
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(async (urlParameters) => await this.fetchProjectById(urlParameters.id));

    this.navBarService.setActiveButton({
      component: BasicNavButtonComponent,
      data: {
        label: "Exit Project",
        callback: () => {
          this.router.navigate(["/"]);
        }
      }
    });
  }

  private async fetchProjectById(id: string) {
    const response = await this.projectApiService.getProjectById(id);
    if (response.errors.length === 0) {
      this.navbarService.setHeader(response.payload.title);
      this.project = response.payload;
    }
  }

  public updateActiveSuite(suiteId: string) {
    this.activeSuite = this.project.suites.find(s => s.id === suiteId);
  }
}
