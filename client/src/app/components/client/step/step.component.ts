import { Component, OnInit, Input } from "@angular/core";
import { ActiveStepService } from "src/app/services/active-step/active-step.service";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { SessionService } from "src/app/services/session/session.service";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-step",
  templateUrl: "./step.component.html",
  styleUrls: ["./step.component.scss"],
  animations: [
    trigger(
      "inOutAnimation",
      [
        transition(
          ":enter",
          [
            style({ width: 0, opacity: 0 }),
            animate("0.08s ease-out",
                    style({ width: 300, opacity: 1 }))
          ]
        ),
        transition(
          ":leave",
          [
            style({ width: 300, opacity: 1 }),
            animate("0.08s ease-in",
                    style({ width: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class StepComponent implements OnInit {

  private step: any;
  private user: IUserResponse;
  private latestFeedback: any;
  public notes: string = "";
  public status: string = "Not Started";

  constructor(
    private activeStepService: ActiveStepService,
    private sessionService: SessionService,
    private stepFeedbackApiService: StepFeedbackApiService
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.getCurrentUser();
    this.activeStepService.getStepSubject().subscribe(step => {
      this.setSelectedStep(step);
    });

    if (this.step) {
      this.setSelectedStep(this.activeStepService.getSelectedStep());
    }
  }

  private async setSelectedStep(step: any) {
    this.step = step;
    if (step) {
      const feedback = await this.stepFeedbackApiService.getLatestStepFeedbackFromUser(this.step.id, this.user.email);
      this.latestFeedback = feedback.payload;
      this.notes = this.latestFeedback.notes;
      this.status = this.step.currentStatus.label;
    }
  }

  public getStepDescription() {
    return this.step ? this.step.description : "No step selected";
  }

  public getLatestFeedbackStatus() {
    if (this.latestFeedback && JSON.stringify(this.latestFeedback) !== JSON.stringify({})) {
      return this.latestFeedback.notes;
    }
    return "Not Started";
  }

  public stepSelected(): boolean {
    return this.step !== null && this.step !== undefined;
  }

  public closeStepPanel() {
    this.activeStepService.setSelectedStep(null);
  }

  public async addFeedback() {
    await this.stepFeedbackApiService.addFeedbackForStep(this.step.id, this.notes, this.status);
    this.activeStepService.stepDetailsUpdated();
  }

  public async addFeedbackAndCloseStepPanel() {
    await this.stepFeedbackApiService.addFeedbackForStep(this.step.id, this.notes, this.status);
    await this.activeStepService.stepDetailsUpdated();
    this.closeStepPanel();
  }

  public getStatusGradientBackgroundClass(): string {
    switch (this.status) {
      case "Passed":
        return "success-border";
      case "Failed":
        return "fail-border";
      default:
        return "not-started-border";
    }
  }
}
