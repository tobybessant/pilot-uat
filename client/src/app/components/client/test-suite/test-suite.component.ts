import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from "@angular/core";
import { ISuiteResponse } from "src/app/models/api/response/client/suite.interface";
import { ICaseResponse } from "src/app/models/api/response/client/case.interface";
import { TestSuiteApiService } from "src/app/services/api/suite/test-suite-api.service";
import { CaseApiService } from "src/app/services/api/case/case-api.service";
import { ActiveTestSuiteService } from "src/app/services/active-suite/active-test-suite.service";
import { ActiveTestCaseService } from "src/app/services/active-test/active-test-case.service";

@Component({
  selector: "app-test-suite-client",
  templateUrl: "./test-suite.component.html",
  styleUrls: ["./test-suite.component.scss"]
})
export class ClientTestSuiteComponent implements OnInit {

  panelOpenState = false;

  @Input()
  public activeSuite: ISuiteResponse;

  @Output()
  public suiteDeleted = new EventEmitter<string>();

  @ViewChild("testTableContainer")
  public tableContainer;

  public tableCanShow: boolean = false;

  public cases: ICaseResponse[] = [];
  public newTestCase: string = "";

  constructor(
    private readonly testSuiteApiService: TestSuiteApiService,
    private readonly testApiService: CaseApiService,
    private readonly activeTestSuiteService: ActiveTestSuiteService,
    private readonly activeTestCaseService: ActiveTestCaseService
  ) { }

  async ngOnInit(): Promise<void> {
    this.activeTestSuiteService.getSubject().subscribe((suite) => {
      this.updateActiveSuite(suite);
    });

    // NOTE: this will catch the race condition where this component initialises
    // after the on-init active suite has been set by the parent project component.
    if (!this.activeSuite) {
      this.updateActiveSuite(this.activeTestSuiteService.getCurrentSuite());
    }
  }

  public getSuiteId(): number | string {
    return this.activeSuite ? this.activeSuite.id : "";
  }

  public getSuiteName(): string {
    return this.activeSuite ? this.activeSuite.title : "";
  }

  private async updateActiveSuite(suite: ISuiteResponse) {
    this.activeSuite = suite;
    this.fetchTestsForActiveSuite();
  }

  private async fetchTestsForActiveSuite() {
    if (this.activeSuite) {
      const response = await this.testApiService.getCasesForSuite<ICaseResponse[]>(this.activeSuite.id);
      this.cases = response.payload;
    }
  }
}
