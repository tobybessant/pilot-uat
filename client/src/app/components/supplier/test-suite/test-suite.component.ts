import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from "@angular/core";
import { ITestSuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { TestSuiteApiService } from "src/app/services/api/test-suite-api.service";
import { TestApiService } from "src/app/services/api/test-api.service";
import { ITestResponse } from "src/app/models/response/supplier/test.interface";
import { ActiveTestSuiteService } from "src/app/services/active-test-suite.service";
import { ActiveTestCaseService } from "src/app/services/active-test-case.service";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-test-suite",
  templateUrl: "./test-suite.component.html",
  styleUrls: ["./test-suite.component.scss"]
})
export class TestSuiteComponent implements OnInit {

  @Input()
  public activeSuite: ITestSuiteResponse;

  @Output()
  public suiteDeleted = new EventEmitter<number>();

  @ViewChild("testTable")
  public testTable: ElementRef<any>;

  @ViewChild(DatatableComponent)
  public table: DatatableComponent;

  public tableCanShow: boolean = false;

  public tests: ITestResponse[] = [];
  public newTestCase: string = "";

  constructor(
    private dialogService: NbDialogService,
    private testSuiteApiService: TestSuiteApiService,
    private testApiService: TestApiService,
    private activeTestSuiteService: ActiveTestSuiteService,
    private activeTestCaseService: ActiveTestCaseService,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinner.show("testCaseSpinner");
    this.activeTestSuiteService.getSubject().subscribe((suite) => {
      this.updateActiveSuite(suite);
    });

    // NOTE: this will catch the race condition where this component initialises
    // after the on-init active suite has been set by the project component.
    if (!this.activeSuite) {
      this.updateActiveSuite(this.activeTestSuiteService.getCurrentSuite());
    }

    setInterval(() => {
      this.tableCanShow = true;
      this.spinner.hide("testCaseSpinner");
    }, 1000);
  }

  private async updateActiveSuite(suite: ITestSuiteResponse) {
    this.activeSuite = suite;
    this.fetchTestsForActiveSuite();
  }

  public promptDeleteSuite() {
    this.dialogService.open(ConfirmationPromptComponent, {
      context: {
        bodyText: `You are about to delete this suite (${this.activeSuite.suiteName}).`,
        confirmButtonText: "Delete",
        confirmAction: () => this.deleteSuite()
      }
    });
  }

  public async deleteSuite() {
    await this.testSuiteApiService.deleteTestSuiteById(this.activeSuite.id);
    this.suiteDeleted.emit(this.activeSuite.id);
  }

  public async addTest() {
    if (this.newTestCase) {
      await this.testApiService.addTest({
        suiteId: this.activeSuite.id,
        testCase: this.newTestCase
      });
      this.newTestCase = "";
      this.fetchTestsForActiveSuite();
    }
  }

  private async fetchTestsForActiveSuite() {
    const response = await this.testApiService.getTestsForSuite(this.activeSuite.id);
    this.tests = response.payload;
  }

  public newCaseSelected({ selected }) {
    this.activeTestCaseService.setTestCase(selected[0]);
  }
}
