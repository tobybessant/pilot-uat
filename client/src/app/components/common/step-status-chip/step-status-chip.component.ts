import { Component, OnInit, Input } from "@angular/core";
import { IStepStatusResponse } from "src/app/models/api/response/supplier/step-status.interface";
import { trigger, state, style, transition, animate } from "@angular/animations";

interface IStatusChipStyle {
  background: string;
  color: string;
  border?: string;
}

@Component({
  selector: "app-step-status-chip",
  templateUrl: "./step-status-chip.component.html",
  styleUrls: ["./step-status-chip.component.scss"],
  animations: [
    // the fade-in/fade-out animation.
    trigger("fade", [

      // fade in when created. this could also be written as transition('void => *')
      transition(":enter", [
        style({ opacity: 0 }),
        animate("30ms", style({ opacity: 1 }))
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

  public getStyle(): IStatusChipStyle {
    if (this.status.label === "Passed") {
      // return { background: "#107d0f", color: "white" };
      return { background: "#189917", color: "white" };
    }

    if (this.status.label === "Failed") {
      return { background: "#da3456", color: "white" };
    }

    // fall back to 'Not Started'
    return { background: "rgba(0,0,0,0.1)", color: "grey" };
  }
}
