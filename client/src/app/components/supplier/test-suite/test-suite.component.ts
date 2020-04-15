import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { ISuiteResponse } from "src/app/models/api/response/supplier/suite.interface";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { TestSuiteApiService } from "src/app/services/api/suite/test-suite-api.service";
import { CaseApiService } from "src/app/services/api/case/case-api.service";
import { ICaseResponse } from "src/app/models/api/response/supplier/case.interface";
import { ActiveTestSuiteService } from "src/app/services/active-suite/active-test-suite.service";
import { ActiveTestCaseService } from "src/app/services/active-test/active-test-case.service";

@Component({
  selector: "app-test-suite",
  templateUrl: "./test-suite.component.html",
  styleUrls: ["./test-suite.component.scss"]
})
export class TestSuiteComponent implements OnInit {

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
    private readonly dialogService: NbDialogService,
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

  public promptDeleteSuite() {
    this.dialogService.open(ConfirmationPromptComponent, {
      context: {
        bodyText: `You are about to delete this suite (${this.activeSuite.title}).`,
        confirmButtonText: "Delete",
        confirmAction: () => this.deleteSuite()
      }
    });
  }

  public async deleteSuite() {
    await this.testSuiteApiService.deleteTestSuiteById(this.activeSuite.projectId, this.activeSuite.id);
    this.suiteDeleted.emit(this.activeSuite.id);
  }

  public async addTest() {
    if (this.newTestCase) {
      await this.testApiService.addCase({
        suiteId: this.activeSuite.id,
        title: this.newTestCase
      });
      this.newTestCase = "";
      this.fetchTestsForActiveSuite();
    }
  }

  private async fetchTestsForActiveSuite() {
    if (this.activeSuite) {
      const response = await this.testApiService.getCasesForSuite<ICaseResponse[]>(this.activeSuite.id);
      this.cases = response.payload;
    }
  }

  public updateSelectedTestCase(id: number) {
    this.fetchTestsForActiveSuite();
    this.activeTestCaseService.setTestCase(null);
  }

  public async testSuiteUpdated(test: ICaseResponse) {
    await this.fetchTestsForActiveSuite();
  }

  public newCaseSelected({ selected }) {
    this.activeTestCaseService.setTestCase(selected[0]);
  }
}
