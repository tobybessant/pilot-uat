import { Component, OnInit, OnDestroy } from "@angular/core";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";

@Component({
  selector: "app-project-client",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ClientProjectComponent implements OnInit, OnDestroy {

  public fetchAttemptComplete = false;
  public activeSuite: ISuiteResponse;

  constructor( ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log("Destroying project");
  }

}
