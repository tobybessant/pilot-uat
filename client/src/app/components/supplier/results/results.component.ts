import { Component, OnInit, Input, Inject, HostListener } from "@angular/core";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { DOCUMENT } from "@angular/common";
import { NbDialogService } from "@nebular/theme";
import { StepFeedbackDetailsDialogComponent } from "../step-feedback-details-dialog/step-feedback-details-dialog.component";

interface ITableSettings {
  minified: boolean;
}

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"]
})
export class ResultsComponent implements OnInit {

  @Input()
  private projectId: string;

  public tableSettings: ITableSettings = {
    minified: false
  };

  public view: any = "overview";

  public clients: any[] = [];
  public project: any;

  constructor(
    @Inject(DOCUMENT) document,
    private feedbackApiService: StepFeedbackApiService,
    private projectsApiService: ProjectApiService,
    private dialogService: NbDialogService
  ) { }

  async ngOnInit(): Promise<void> {
    const projectFeedbackPerUser = await this.feedbackApiService.getAllFeedbackForProject(this.projectId);
    this.clients = projectFeedbackPerUser.payload;

    this.project = (await this.projectsApiService.getProjectById(this.projectId, true)).payload;
  }

  public getClientFeedbackStatusForStep(client: any, step: any) {
    const user = this.clients.find(c => c.email === client.email);
    if (user?.feedback) {
      const feedback = user.feedback[step.id];
      if (feedback) {
        return feedback.status;
      }
    }
    return { label: "Not Started" };
  }

  public getClientFeedbackNotesForStep(client: any, step: any): string {
    const user = this.clients.find(c => c.email === client.email);
    if (user?.feedback) {
      const feedback = user.feedback[step.id];
      if (feedback) {
        return feedback.notes;
      }
    }
    return  "";
  }

  public collapse(evt, item: any) {
    evt.stopPropagation();
    item.collapsed = item.collapsed ? !item.collapsed : true;
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(e) {
    if (window.pageYOffset > 220) {
      const element = document.getElementById("table-headings");
      element.classList.add("sticky");
    } else {
      const element = document.getElementById("table-headings");
      element.classList.remove("sticky");
    }
  }

  public getClientsToShow() {
    if (this.view !== "overview") {
      return this.clients.filter(c => c.email === this.view);
    }
    return this.clients;
  }

  public openFeedbackModal(client: any, step: any) {
    let feedback: any;
    const user = this.clients.find(c => c.email === client.email);
    if (user?.feedback) {
      const fb = user.feedback[step.id];
      if (fb) {
        feedback = fb;
      }
    }

    console.log(feedback);
    this.dialogService.open(StepFeedbackDetailsDialogComponent, {
      context: {
        step,
        feedback
      }
    });
  }
}
