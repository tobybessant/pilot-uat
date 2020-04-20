import { Component, OnInit, Input, Inject, HostListener, ChangeDetectorRef } from "@angular/core";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { DOCUMENT } from "@angular/common";
import { NbDialogService } from "@nebular/theme";
import { StepFeedbackDetailsDialogComponent } from "../step-feedback-details-dialog/step-feedback-details-dialog.component";
import { IResultsMatrixData, IUserStepFeedback } from "src/app/models/api/response/supplier/results-matrix.interface";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";

interface ITableSettings {
  minified: boolean;
  selectedUser: string;
}

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"]
})
export class ResultsComponent implements OnInit {

  @Input()
  private projectId: string;

  private TABLE_SETTINGS_KEY;
  public tableSettings: ITableSettings = {
    minified: false,
    selectedUser: "none"
  };

  public clientResultsMatrix: IResultsMatrixData[] = [];
  public project: any;

  constructor(
    @Inject(DOCUMENT) private document,
    private feedbackApiService: StepFeedbackApiService,
    private projectsApiService: ProjectApiService,
    private dialogService: NbDialogService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    this.TABLE_SETTINGS_KEY = `${this.projectId}_TABLE_SETTINGS`;
    const projectFeedbackPerUser = await this.feedbackApiService.getAllFeedbackForProject(this.projectId);
    this.clientResultsMatrix = projectFeedbackPerUser.payload;

    this.project = (await this.projectsApiService.getProjectById(this.projectId, true)).payload;

    this.loadTableSettings();
    this.cdr.detectChanges();
  }

  public getClientFeedbackStatusForStep(id: string, step: IStepResponse) {
    const user = this.getUserFromMatrixData(id);
    if (user?.feedback) {
      const feedback = user.feedback[step.id];
      if (feedback) {
        return feedback.status;
      }
    }
    return { label: "Not Started" };
  }

  public getClientFeedbackNotesForStep(id: string, step: IStepResponse): string {
    const user = this.getUserFromMatrixData(id);
    if (user?.feedback) {
      const f = user.feedback[step.id];
      if (f) {
        return f.notes;
      }
    }
    return "";
  }

  public collapse(evt, item: any) {
    evt.stopPropagation();
    item.collapsed = item.collapsed ? !item.collapsed : true;
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.pageYOffset > 220) {
      const element = this.document.getElementById("table-headings");
      element.classList.add("sticky");
    } else {
      const element = this.document.getElementById("table-headings");
      element.classList.remove("sticky");
    }
  }

  public getClientsToShow() {
    const user = this.getUserFromMatrixData(this.tableSettings.selectedUser);
    if (user) {
      const u = this.tableSettings.selectedUser;
      return this.clientResultsMatrix.filter(c => c.email === user.email);
    }
    return this.clientResultsMatrix;
  }

  public openFeedbackModal(id: string, step: IStepResponse) {
    const user = this.getUserFromMatrixData(id);
    let feedback: IUserStepFeedback;
    if (user?.feedback) {
      const fb = user.feedback[step.id];
      if (fb) {
        feedback = fb;
      }
    }

    this.dialogService.open(StepFeedbackDetailsDialogComponent, {
      context: {
        step,
        feedback
      }
    });
  }

  public userIsSelected(): boolean {
    return this.tableSettings.selectedUser !== "none";
  }

  public loadTableSettings() {
    const existingTableSettings = this.localStorageService.get(this.TABLE_SETTINGS_KEY);
    if (existingTableSettings) {
      this.tableSettings = existingTableSettings;
      console.log(this.tableSettings);
    } else {
      this.saveTableSettings();
    }
  }

  public saveTableSettings() {
    this.localStorageService.set(this.TABLE_SETTINGS_KEY, this.tableSettings);
  }

  private getUserFromMatrixData(id: string): IResultsMatrixData | undefined {
    return this.clientResultsMatrix.find(r => r.id === id);
  }
}
