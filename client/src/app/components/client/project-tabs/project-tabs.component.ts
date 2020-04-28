import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { NavbarService } from "src/app/services/navbar/navbar.service";
import { BasicNavButtonComponent } from "../../common/nav/basic-nav-button/basic-nav-button.component";
import { Router, ActivatedRoute, UrlSegment } from "@angular/router";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { NbTabComponent } from "@nebular/theme";

@Component({
  selector: "app-project-tabs",
  templateUrl: "./project-tabs.component.html",
  styleUrls: ["./project-tabs.component.scss"]
})
export class ProjectTabsComponent implements OnInit {

  public project: IProjectResponse;

  public activeSuite: ISuiteResponse;

  constructor(
    private router: Router,
    private location: Location,
    private navBarService: NavbarService,
    private activeRoute: ActivatedRoute,
    private projectApiService: ProjectApiService,
    private navbarService: NavbarService
  ) { }

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

  public updateUrlParameter(tab: NbTabComponent) {
    const urlSegs: UrlSegment[] = this.activeRoute.snapshot.url;
    const tabUrl: string = tab.tabTitle.toLocaleLowerCase();

    if (urlSegs.length === 2 || urlSegs.length === 3 && urlSegs[2].path !== tabUrl) {
      this.location.replaceState(`${urlSegs[0].path}/${urlSegs[1].path}/${tabUrl}`);
    }
  }
}
