import { Component, OnInit, Input } from "@angular/core";
import { ISuiteResponse } from "src/app/models/response/supplier/suite.interface";

@Component({
  selector: "app-test-suite",
  templateUrl: "./test-suite.component.html",
  styleUrls: ["./test-suite.component.scss"]
})
export class TestSuiteComponent implements OnInit {

  @Input()
  public activeSuite: ISuiteResponse;

  constructor() { }

  ngOnInit(): void {
  }

}
