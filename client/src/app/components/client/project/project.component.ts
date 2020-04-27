import { Component, OnInit, OnDestroy } from "@angular/core";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { IProjectResponse } from "src/app/models/api/response/client/project.interface";
import { ActiveProjectService } from "src/app/services/active-project/active-project.service";

@Component({
  selector: "app-project-client",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ClientProjectComponent implements OnInit, OnDestroy {

  public fetchAttemptComplete = false;
  public activeSuite: ISuiteResponse;

  constructor(
    private activeProjectService: ActiveProjectService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log("Destroying project");
  }

  public getActiveProject(): IProjectResponse {
    return this.activeProjectService.getActiveProject();
  }
}
