import { Component, OnInit, Input } from "@angular/core";
import { IStepStatusResponse } from "src/app/models/api/response/supplier/step-status.interface";

@Component({
  selector: "app-step-status-chip",
  templateUrl: "./step-status-chip.component.html",
  styleUrls: ["./step-status-chip.component.scss"]
})
export class StepStatusChipComponent implements OnInit {

  @Input()
  public status: IStepStatusResponse;

  constructor() { }

  ngOnInit(): void {
  }

  public getBackground(): string {
    switch (this.status.label) {
      case "Passed":
        return "var(--color-success-300)";
      case "Failed":
        return "var(--color-danger-300)";
      default:
        return "var(--color-primary-transparent-100)";
    }
  }

}
