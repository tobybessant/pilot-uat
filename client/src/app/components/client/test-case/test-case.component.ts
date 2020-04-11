import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ICaseResponse } from "src/app/models/api/response/client/case.interface";
import { IStepResponse } from "src/app/models/api/response/client/step.interface";
import { CaseApiService } from "src/app/services/api/case/case-api.service";
import { StepApiService } from "src/app/services/api/step/step-api.service";
import { NbDialogService } from "@nebular/theme";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";

@Component({
  selector: "app-test-case-client",
  templateUrl: "./test-case.component.html",
  styleUrls: ["./test-case.component.scss"]
})
export class ClientTestCaseComponent implements OnInit {

  @Input()
  public case: ICaseResponse;

  public steps: IStepResponse[] = [];

  constructor(
    private stepApiService: StepApiService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.fetchStepsForCase();
  }

  public async fetchStepsForCase() {
    const response = await this.stepApiService.getStepsforCase<IStepResponse[]>(this.case.id);
    this.steps = response.payload;
  }


}
