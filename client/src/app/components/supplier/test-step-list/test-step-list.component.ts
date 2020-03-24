import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IStepResponse } from "src/app/models/api/response/supplier/step.interface";
import { NbDialogService } from "@nebular/theme";
import { EditTestStepDialogComponent } from "../edit-test-step-dialog/edit-test-step-dialog.component";

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

  public newStepDescription: string;

  constructor(private dialogService: NbDialogService) { }

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
}
