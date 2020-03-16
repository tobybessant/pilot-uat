import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ITestSuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { TestSuiteApiService } from "src/app/services/api/test-suite-api.service";
import { TestApiService } from "src/app/services/api/test-api.service";
import { ITestResponse } from "src/app/models/response/supplier/test.interface";
import { ActiveTestSuiteService } from "src/app/services/active-test-suite.service";

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

  public tests: ITestResponse[] = [];

  public rows = [
    { name: "Austin", gender: "Male", company: "Swimlane" },
    { name: "Dany", gender: "Male", company: "KFC" },
    { name: "Molly", gender: "Female", company: "Burger King" },
  ];

  constructor(
    private dialogService: NbDialogService,
    private testSuiteApiService: TestSuiteApiService,
    private testApiService: TestApiService,
    private activeTestSuiteService: ActiveTestSuiteService
  ) { }

  async ngOnInit(): Promise<void> {
    this.activeTestSuiteService.getSubject().subscribe((suite) => {
      this.updateActiveSuite(suite);
    });

    // NOTE: this will catch the race condition where this component initialises
    // after the on-init active suite has been set by the project component.
    if (!this.activeSuite) {
      this.updateActiveSuite(this.activeTestSuiteService.getCurrentSuite());
    }
  }

  private async updateActiveSuite(suite: ITestSuiteResponse) {
    const response = await this.testApiService.getTestsForSuite(suite.id);
    this.activeSuite = suite;
    this.tests = response.payload;
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
}
