import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from "@angular/core";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { ICaseResponse } from "src/app/models/api/response/client/case.interface";
import { CaseApiService } from "src/app/services/api/case/case-api.service";

@Component({
  selector: "app-test-suite-client",
  templateUrl: "./test-suite.component.html",
  styleUrls: ["./test-suite.component.scss"]
})
export class ClientTestSuiteComponent {

  panelOpenState = false;

  private _activeSuite: ISuiteResponse;

  @Input()
  public set activeSuite(value: ISuiteResponse) {
    this._activeSuite = value;
    this.fetchTestsForActiveSuite();
  }

  public get activeSuite(): ISuiteResponse {
    return this._activeSuite;
  }

  @Output()
  public suiteDeleted = new EventEmitter<string>();

  @ViewChild("testTableContainer")
  public tableContainer;

  public tableCanShow: boolean = false;

  public cases: ICaseResponse[] = [];
  public newTestCase: string = "";

  constructor(
    private readonly testApiService: CaseApiService,
  ) { }

  public getSuiteId(): number | string {
    return this._activeSuite ? this._activeSuite.id : "";
  }

  public getSuiteName(): string {
    return this._activeSuite ? this._activeSuite.title : "";
  }

  private async fetchTestsForActiveSuite() {
    if (this._activeSuite) {
      const response = await this.testApiService.getCasesForSuite<ICaseResponse[]>(this._activeSuite.id);
      this.cases = response.payload;
    }
  }
}
