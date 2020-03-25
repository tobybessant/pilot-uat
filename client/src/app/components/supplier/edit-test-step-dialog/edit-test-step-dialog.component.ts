import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";
import { StepApiService } from "src/app/services/api/step/step-api.service";

@Component({
  selector: "app-edit-test-step-dialog",
  templateUrl: "./edit-test-step-dialog.component.html",
  styleUrls: ["./edit-test-step-dialog.component.scss"]
})
export class EditTestStepDialogComponent implements OnInit {

  @Input()
  public step: IStepResponse;

  public stepDescriptionInput: string;

  constructor(
    protected dialogRef: NbDialogRef<any>,
    private stepApiService: StepApiService
  ) { }

  ngOnInit(): void {
    this.stepDescriptionInput = this.step.description;
  }

  public close() {
    this.dialogRef.close(this.step);
  }

  public async saveStep(): Promise<void> {
    if (this.stepDescriptionInput) {
      this.step.description = this.stepDescriptionInput;
      const update = await this.stepApiService.updateStep(this.step);
      this.close();
    }
  }
}
