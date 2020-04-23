import { Component, OnInit, Input, Inject, HostListener, ChangeDetectorRef } from "@angular/core";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { DOCUMENT } from "@angular/common";
import { NbDialogService } from "@nebular/theme";
import { StepFeedbackDetailsDialogComponent } from "../step-feedback-details-dialog/step-feedback-details-dialog.component";
import { IResultsMatrixData, IUserStepFeedback } from "src/app/models/api/response/supplier/results-matrix.interface";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatrixColumnDialogComponent } from "../matrix-column-dialog/matrix-column-dialog.component";

interface ITableSettings {
  minified: boolean;
  viewingUser: string;
  userColumns: string[];
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
    viewingUser: "none",
    userColumns: []
  };
  public showStickyHeader: boolean = false;

  public clientResultsMatrix: IResultsMatrixData[] = [];
  public project: any;

  public isLoading: boolean = true;
  public readonly SPINNER_NAME: string = "results_matrix";

  constructor(
    @Inject(DOCUMENT) private document,
    private feedbackApiService: StepFeedbackApiService,
    private projectsApiService: ProjectApiService,
    private dialogService: NbDialogService,
    private localStorageService: LocalStorageService,
    private spinnerService: NgxSpinnerService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading(true);

    this.TABLE_SETTINGS_KEY = `${this.projectId}_TABLE_SETTINGS`;
    const projectFeedbackPerUser = await this.feedbackApiService.getAllFeedbackForProject(this.projectId);
    this.clientResultsMatrix = projectFeedbackPerUser.payload;

    this.project = (await this.projectsApiService.getProjectById(this.projectId, true)).payload;

    for (let i = 0; i < 3 && i < this.clientResultsMatrix.length; i++) {
      console.log(i);
      this.tableSettings.userColumns.push(this.clientResultsMatrix[i].id);
    }

    this.loadTableSettings();

    setTimeout(() => {
      this.loading(false);
    }, 1000);
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
    if (window.pageYOffset > 263) {
      this.showStickyHeader = true;
    } else {
      this.showStickyHeader = false;
    }
  }

  public getClientsToShow() {
    const user = this.getUserFromMatrixData(this.tableSettings.viewingUser);
    if (user) {
      const u = this.tableSettings.viewingUser;
      return this.clientResultsMatrix.filter(c => c.email === user.email);
    }

    return this.clientResultsMatrix.filter(u => {
      return this.tableSettings.userColumns.includes(u.id);
    });
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
    return this.tableSettings.viewingUser !== "none";
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

  private loading(isLoading: boolean) {
    isLoading ? this.spinnerService.show(this.SPINNER_NAME) : this.spinnerService.hide(this.SPINNER_NAME);
    this.isLoading = isLoading;
  }

  public openEditMatrixColumnsDialog() {
    this.dialogService.open(MatrixColumnDialogComponent, {
      context: {
        matrixClients: this.clientResultsMatrix,
        selectedClients: this.tableSettings.userColumns
      }
    }).onClose.subscribe((selectedColumns: string[]) => {
      this.tableSettings.userColumns = selectedColumns;
      this.saveTableSettings();
    });
  }
}
