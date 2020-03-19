import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { ITestSuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { TestSuiteApiService } from "src/app/services/api/test-suite-api.service";
import { TestApiService } from "src/app/services/api/test-api.service";
import { ITestResponse } from "src/app/models/response/supplier/test.interface";
import { ActiveTestSuiteService } from "src/app/services/active-test-suite.service";
import { ActiveTestCaseService } from "src/app/services/active-test-case.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-test-suite",
  templateUrl: "./test-suite.component.html",
  styleUrls: ["./test-suite.component.scss"]
})
export class TestSuiteComponent implements OnInit {

  panelOpenState = false;

  @Input()
  public activeSuite: ITestSuiteResponse;

  @Output()
  public suiteDeleted = new EventEmitter<number>();

  @ViewChild("testTableContainer")
  public tableContainer;

  public tableCanShow: boolean = false;

  public tests: ITestResponse[] = [];
  public newTestCase: string = "";

  constructor(
    private readonly dialogService: NbDialogService,
    private readonly testSuiteApiService: TestSuiteApiService,
    private readonly testApiService: TestApiService,
    private readonly activeTestSuiteService: ActiveTestSuiteService,
    private readonly activeTestCaseService: ActiveTestCaseService,
    private readonly spinner: NgxSpinnerService
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

    this.loadAndRenderTable();
  }

  public getSuiteId(): number | string {
    return this.activeSuite ? this.activeSuite.id : "";
  }

  public getSuiteName(): string {
    return this.activeSuite ? this.activeSuite.suiteName : "";
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
    if (this.activeSuite) {
      const response = await this.testApiService.getTestsForSuite(this.activeSuite.id);
      this.tests = response.payload;
    }
  }

  public updateSelectedTestCase(id: number) {
    this.fetchTestsForActiveSuite();
    this.activeTestCaseService.setTestCase(null);
  }

  public async testSuiteUpdated(test: ITestResponse) {
    await this.fetchTestsForActiveSuite();
    if (this.activeSuite) {
      // const existingSelectionIndex = this.tests.findIndex(t => t.id === test.id);
      // this.table.selected.push(this.tests[existingSelectionIndex]);
      // console.log(this.table.selected);
    }
  }

  public newCaseSelected({ selected }) {
    this.activeTestCaseService.setTestCase(selected[0]);
  }

  private loadAndRenderTable() {
    // NOTE: this is in place to fix the data table from loading before the card and
    // not being contained within the screen without scrolling. Delaying the load
    // forces it to consider the size of the card before loading data in.
    setTimeout(() => {
      // this.calculateColumnWidths();
      this.tableCanShow = true;
      this.spinner.hide("testCaseSpinner");
    }, 3000);
  }

  // private calculateColumnWidths() {
  //   if (this.tableContainer) {
  //     const width = this.tableContainer.nativeElement.clientWidth;
  //     let currentPercentageTotal = 0;

  //     // convert widthPercentage property into px value
  //     for (const column of this.columns) {
  //       if (column.widthPercentage) {
  //         currentPercentageTotal += column.widthPercentage;
  //         column.width = width * (column.widthPercentage / 100);
  //       }
  //     }

  //     if (currentPercentageTotal > 100) {
  //       throw new Error("Summed column width proportions are larger than 100");
  //     }
  //   }
  // }
}
