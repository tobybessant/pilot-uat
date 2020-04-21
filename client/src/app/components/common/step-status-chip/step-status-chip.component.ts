import { Component, OnInit, Input } from "@angular/core";
import { IStepStatusResponse } from "src/app/models/api/response/supplier/step-status.interface";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-step-status-chip",
  templateUrl: "./step-status-chip.component.html",
  styleUrls: ["./step-status-chip.component.scss"],
  animations: [
    // the fade-in/fade-out animation.
    trigger("fade", [

      // fade in when created. this could also be written as transition('void => *')
      transition(":enter", [
        style({opacity: 0}),
        animate("30ms", style({opacity: 1}))
      ])
    ])
  ]
})
export class StepStatusChipComponent implements OnInit {

  @Input()
  public status: IStepStatusResponse;

  @Input()
  public minified: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public getBackground(): string {
    switch (this.status.label) {
      case "Passed":
        return "var(--color-success-400)";
      case "Failed":
        return "var(--color-danger-400)";
      default:
        return "var(--color-primary-transparent-200)";
    }
  }
}
