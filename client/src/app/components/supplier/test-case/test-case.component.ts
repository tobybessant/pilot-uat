import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ICaseResponse } from "src/app/models/api/response/supplier/case.interface";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { NbDialogService } from "@nebular/theme";
import { CaseApiService } from "src/app/services/api/case/case-api.service";
import { StepApiService } from "src/app/services/api/step/step-api.service";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";

@Component({
  selector: "app-test-case",
  templateUrl: "./test-case.component.html",
  styleUrls: ["./test-case.component.scss"]
})
export class TestCaseComponent implements OnInit {

  @Input()
  public case: ICaseResponse;

  @Output()
  public testDeleted = new EventEmitter<string>();

  @Output()
  public testUpdated = new EventEmitter<ICaseResponse>();

  public steps: IStepResponse[] = [];

  constructor(
    private testCaseApiService: CaseApiService,
    private stepApiService: StepApiService,
    private dialogService: NbDialogService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.fetchStepsForCase();
  }

  public promptDeleteTest() {
    this.dialogService.open(ConfirmationPromptComponent, {
      context: {
        bodyText: `You are about to delete this case (${this.case.title}).`,
        confirmButtonText: "Delete",
        confirmAction: () => this.deleteTest()
      }
    });
  }

  public async deleteTest() {
    const response = await this.testCaseApiService.deleteCaseById(this.case.id);
    if (response.errors.length === 0) {
      this.testDeleted.emit(this.case.id);
    }
  }

  public async saveTest() {
    const response = await this.testCaseApiService.updateCase(this.case);
    this.testUpdated.emit(response.payload);
  }

  public async fetchStepsForCase() {
    const response = await this.stepApiService.getStepsforCase(this.case.id);
    this.steps = response.payload;
  }

  public async caseStepAdded($event) {
    if ($event) {
      await this.stepApiService.addStepToCase($event, this.case.id);
      await this.fetchStepsForCase();
    }
  }

  public async caseStepUpdated() {
    await this.fetchStepsForCase();
  }

}
