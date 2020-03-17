import { Component, OnInit } from "@angular/core";
import { ActiveTestCaseService } from "src/app/services/active-test-case.service";
import { ITestResponse } from "src/app/models/response/supplier/test.interface";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { NbDialogService } from "@nebular/theme";
import { TestApiService } from "src/app/services/api/test-api.service";

@Component({
  selector: "app-test-case",
  templateUrl: "./test-case.component.html",
  styleUrls: ["./test-case.component.scss"]
})
export class TestCaseComponent implements OnInit {

  public test: ITestResponse;

  constructor(
    private activeTestCaseService: ActiveTestCaseService,
    private testCaseApiService: TestApiService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.activeTestCaseService.getSubject().subscribe((test) => {
      this.test = test;
    });
  }

  public promptDeleteTest() {
    this.dialogService.open(ConfirmationPromptComponent, {
      context: {
        bodyText: `You are about to delete this case (${this.test.testCase}).`,
        confirmButtonText: "Delete",
        confirmAction: () => this.deleteTest()
      }
    });
  }

  public async deleteTest() {
    // await this.testCaseApiService;
    // this.suiteDeleted.emit(this.activeSuite.id);
  }

}
