import { Component, OnInit, Input } from "@angular/core";
import { NavbarService } from "src/app/services/navbar/navbar.service";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { BasicNavButtonComponent } from "../../common/nav/basic-nav-button/basic-nav-button.component";
import { CaseApiService } from "src/app/services/api/case/case-api.service";
import { StepApiService } from "src/app/services/api/step/step-api.service";
import { IStepResponse } from "src/app/models/api/response/client/step.interface";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { SessionService } from "src/app/services/session/session.service";
import { IStepFeedbackResponse } from "src/app/models/api/response/client/stepFeedback.interface";
import { IStepStatusResponse } from "src/app/models/api/response/supplier/step-status.interface";

@Component({
  selector: "app-step-wizard",
  templateUrl: "./step-wizard.component.html",
  styleUrls: ["./step-wizard.component.scss"]
})
export class StepWizardComponent implements OnInit {

  public steps: IStepResponse[] = [];
  private feedback: Map<string, IStepFeedbackResponse>;

  private activeStepIndex: number = 0;

  public activeStepFeedbackNotes: string = "";
  public activeStepFeedbackStatus: string = "Not Started";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navbarService: NavbarService,
    private stepApiService: StepApiService,
    private stepFeedbackApiService: StepFeedbackApiService,
    private sessionService: SessionService
  ) { }

  async ngOnInit(): Promise<void> {
    this.navbarService.setHeader("");
    this.navbarService.setActiveButton({
      component: BasicNavButtonComponent,
      data: {
        label: "Back to Project",
        callback: () => {
          const url = this.getResolvedUrl(this.route.snapshot);
          this.router.navigate([url[0]]);
        }
      }
    });

    this.feedback = new Map<string, IStepFeedbackResponse>();

    this.route.paramMap.subscribe(async p => await this.fetchSteps(p.get("caseId")));
  }

  private getResolvedUrl(route: ActivatedRouteSnapshot): string[] {
    return route.pathFromRoot
      .map(
        v => v.url.map(segment => segment.toString()).join("/")
      )
      .filter(s => s !== "");
  }

  private async fetchSteps(caseId: string): Promise<void> {
    const stepsResponse = await this.stepApiService.getStepsforCase<IStepResponse[]>(caseId);
    this.steps = stepsResponse.payload;

    for (const step of this.steps) {
      const feedbackForStep = await this.stepFeedbackApiService
        .getLatestStepFeedbackFromUser(step.id, this.sessionService.getCurrentUser().email);

      this.feedback.set(step.id, feedbackForStep.payload);
    }

    this.loadStepData();
  }

  public async nextStep(): Promise<void> {
    if (this.stepFeedbackChanged()) {
      await this.addStepFeedback();
    }

    if (this.activeStepIndex < this.steps.length - 1) {
      this.activeStepIndex++;
      await this.loadStepData();
    }
  }

  public prevStep(): void {
    if (this.activeStepIndex > 0) {
      this.activeStepIndex--;
      this.loadStepData();
    }
  }

  private async loadStepData(): Promise<void> {
    const stepId = this.getActiveStep().id;

    if (!this.feedback.has(stepId) || this.feedback.get(stepId) !== undefined) {
      const feedbackForStep = await this.stepFeedbackApiService
        .getLatestStepFeedbackFromUser(stepId, this.sessionService.getCurrentUser().email);

      this.feedback.set(stepId, feedbackForStep.payload);
      this.loadFeedbackForStep(stepId);
    }
  }

  public getActiveStep(): IStepResponse {
    return this.steps[this.activeStepIndex];
  }

  public getActiveStepDescription(): string {
    const step = this.steps[this.activeStepIndex];
    if (step) {
      return step.description;
    }
    return "";
  }

  public getTotalSteps(): number {
    return this.steps.length;
  }

  public getCurrentStepIndex(): number {
    return this.activeStepIndex + 1;
  }

  private loadFeedbackForStep(stepId: string): void {
    const feedback = this.feedback.get(stepId);

    this.activeStepFeedbackNotes = feedback.notes;
    this.activeStepFeedbackStatus = feedback.status.label;
  }

  public getFeedbackStatusForStep(stepId: string): IStepStatusResponse {
    if (this.feedback.has(stepId) || this.feedback.get(stepId) !== undefined) {
      return this.feedback.get(stepId).status;
    }

    return { id: "3", label: "Not Started" };
  }

  private async addStepFeedback(): Promise<void> {
    const stepId = this.getActiveStep().id;
    await this.stepFeedbackApiService.addFeedbackForStep(stepId, this.activeStepFeedbackNotes, this.activeStepFeedbackStatus);
    this.loadStepData();
  }

  private stepFeedbackChanged(): boolean {
    const feedback = this.feedback.get(this.getActiveStep().id);
    if (!feedback) {
      return true;
    }

    const notesChanged = feedback.notes !== this.activeStepFeedbackNotes;
    const statusChanged = feedback.status.label !== this.activeStepFeedbackStatus;

    return notesChanged || statusChanged;
  }

  public isCurrentStep(step: IStepResponse): boolean {
    return this.steps.indexOf(step) === this.activeStepIndex;
  }

  public getNextButtonText(): string {
    return this.steps.length === this.activeStepIndex + 1 ? "Finish" : "Next Step";
  }
}
