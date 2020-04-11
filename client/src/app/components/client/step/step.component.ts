import { Component, OnInit, Input } from "@angular/core";
import { ActiveStepService } from "src/app/services/active-step/active-step.service";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { SessionService } from "src/app/services/session/session.service";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";

@Component({
  selector: "app-step",
  templateUrl: "./step.component.html",
  styleUrls: ["./step.component.scss"]
})
export class StepComponent implements OnInit {

  private step: any;
  private user: IUserResponse;
  private latestFeedback: any;

  constructor(
    private activeStepService: ActiveStepService,
    private sessionService: SessionService,
    private stepFeedbackApiService: StepFeedbackApiService
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.getCurrentUser();
    this.activeStepService.getSubject().subscribe(step => {
      this.setSelectedStep(step);
    });

    if (this.step) {
      this.setSelectedStep(this.activeStepService.getSelectedStep());
    }
  }

  private async setSelectedStep(step: any) {
    this.step = step;
    const feedback = await this.stepFeedbackApiService.getLatestStepFeedbackFromUser(this.step.id, this.user.email);
    this.latestFeedback = feedback.payload;
    console.log(this.latestFeedback);
  }

  public getStepName() {
    return this.step ? this.step.description : "No step selected";
  }

  public getLatestFeedbackStatus() {
    return this.latestFeedback ? this.latestFeedback.notes : "Not Started";
  }
}
