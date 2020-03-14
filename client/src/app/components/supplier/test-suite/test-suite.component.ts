import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ITestSuiteResponse } from "src/app/models/response/supplier/suite.interface";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { TestSuiteApiService } from "src/app/services/api/test-suite-api.service";

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

  constructor(
    private dialogService: NbDialogService,
    private testSuiteApiService: TestSuiteApiService
  ) { }

  ngOnInit(): void {
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
