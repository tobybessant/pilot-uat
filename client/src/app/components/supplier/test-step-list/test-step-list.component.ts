import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";
import { NbDialogService } from "@nebular/theme";
import { EditTestStepDialogComponent } from "../edit-test-step-dialog/edit-test-step-dialog.component";
import { ConfirmationPromptComponent } from "../../common/confirmation-prompt/confirmation-prompt.component";
import { StepApiService } from "src/app/services/api/step/step-api.service";

@Component({
  selector: "app-test-step-list",
  templateUrl: "./test-step-list.component.html",
  styleUrls: ["./test-step-list.component.scss"]
})
export class TestStepListComponent implements OnInit {

  @Input()
  public steps: IStepResponse[] = [];

  @Output()
  public stepAdded = new EventEmitter<string>();

  @Output()
  public stepUpdated = new EventEmitter<void>();

  @Output()
  public stepDeleted = new EventEmitter<void>();

  public newStepDescription: string;

  constructor(private dialogService: NbDialogService, private stepApiService: StepApiService) { }

  ngOnInit(): void {
  }

  public async addTestToCase(): Promise<void> {
    this.stepAdded.emit(this.newStepDescription);
    this.newStepDescription = "";
  }

  public async editStep(id: string): Promise<void> {
    const step: IStepResponse = this.steps.find(s => s.id === id);
    this.dialogService.open(EditTestStepDialogComponent, {
      autoFocus: true,
      context: { step }
    });
  }

  public async promptDeleteStep(id: string, description: string): Promise<void> {
    this.dialogService.open(ConfirmationPromptComponent, {
      autoFocus: true,
      context: {
        bodyText: "You are about to delete this step (" + description + ")",
        confirmButtonText: "Delete",
        confirmAction: async () => {
          this.deleteStep(id);
        }
      }
    });
  }

  public async deleteStep(id: string) {
    await this.stepApiService.deleteStepById(id);
    this.stepDeleted.emit();
  }
}
