import { Component, OnInit, HostListener } from "@angular/core";
import { ActiveStepService } from "src/app/services/active-step/active-step.service";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { SessionService } from "src/app/services/session/session.service";
import { IUserResponse } from "src/app/models/api/response/common/user.interface";
import { IStepResponse } from "src/app/models/api/response/client/step.interface";
import { IStepFeedbackResponse } from "src/app/models/api/response/client/stepFeedback.interface";

@Component({
  selector: "app-step",
  templateUrl: "./step.component.html",
  styleUrls: ["./step.component.scss"]
})
export class StepComponent implements OnInit {

  private step: IStepResponse;
  private user: IUserResponse;
  private latestFeedback: IStepFeedbackResponse;
  public notes: string = "";
  public status: string = "Not Started";

  public stickyStepModal: boolean;

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
      this.notes = this.latestFeedback?.notes || "";
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
    const response = await this.stepFeedbackApiService.addFeedbackForStep(this.step.id, this.notes, this.status);
    if (response.errors.length === 0) {
      await this.activeStepService.stepDetailsUpdated();
      this.closeStepPanel();
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScrollCheckShouldStick(e) {
    if (window.pageYOffset > 200) {
      this.stickyStepModal = true;
    }

    // NOTE: Checking scroll offset not being 0 for when the select drop down
    // options are being shown (NebularUI appears to set a root class to block)
    // scrolling which un-stickies the component
    if (window.pageYOffset < 200 && window.pageYOffset !== 0) {
      this.stickyStepModal = false;
    }
  }
}
