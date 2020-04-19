import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-step-feedback-details-dialog",
  templateUrl: "./step-feedback-details-dialog.component.html",
  styleUrls: ["./step-feedback-details-dialog.component.scss"]
})
export class StepFeedbackDetailsDialogComponent implements OnInit {

  @Input()
  public step: any;

  @Input()
  public feedback: any;

  constructor(
    protected dialogRef: NbDialogRef<any>,
  ) { }

  ngOnInit(): void {
  }

  public close() {
    this.dialogRef.close();
  }

  public getFormattedCreatedTime(): string {
    return this.feedback ? new Date(this.feedback.createdDate).toDateString() : "Unknown";
  }

  public getFeedbackNotes() {
    return this.feedback?.notes || "";
  }

  public getStepDescription() {
    return this.step.description;
  }
}
