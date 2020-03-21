import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ActiveTestCaseService } from "src/app/services/active-test-case.service";
import { ICaseResponse } from "src/app/models/api/response/supplier/test.interface";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { NbDialogService } from "@nebular/theme";
import { TestApiService } from "src/app/services/api/test-api.service";

@Component({
  selector: "app-test-case",
  templateUrl: "./test-case.component.html",
  styleUrls: ["./test-case.component.scss"]
})
export class TestCaseComponent implements OnInit {

  @Input()
  public test: ICaseResponse;

  @Output()
  public testDeleted = new EventEmitter<number>();

  @Output()
  public testUpdated = new EventEmitter<ICaseResponse>();

  constructor(
    private activeTestCaseService: ActiveTestCaseService,
    private testCaseApiService: TestApiService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.activeTestCaseService.getSubject().subscribe((test) => {
      this.selectedTestChange(test);
    });
  }

  private selectedTestChange(test: ICaseResponse) {
    if (test) {
      this.test = test;
    } else {
      this.test = null;
    }
  }

  public promptDeleteTest() {
    this.dialogService.open(ConfirmationPromptComponent, {
      context: {
        bodyText: `You are about to delete this case (${this.test.title}).`,
        confirmButtonText: "Delete",
        confirmAction: () => this.deleteTest()
      }
    });
  }

  public async deleteTest() {
    const response = await this.testCaseApiService.deleteTestById(this.test.id);
    if (response.errors.length === 0) {
      this.testDeleted.emit(this.test.id);
    }
  }

  public async saveTest() {
    const response = await this.testCaseApiService.updateTest(this.test);
    this.testUpdated.emit(response.payload);
  }

}
