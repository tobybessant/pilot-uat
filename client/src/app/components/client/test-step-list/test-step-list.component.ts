import { Component, OnInit, Input } from "@angular/core";
import { IStepResponse } from "src/app/models/api/response/client/step.interface";
import { ActiveStepService } from "src/app/services/active-step/active-step.service";

@Component({
  selector: "app-test-step-list-client",
  templateUrl: "./test-step-list.component.html",
  styleUrls: ["./test-step-list.component.scss"]
})
export class ClientTestStepListComponent implements OnInit {

  @Input()
  public steps: IStepResponse[] = [];

  constructor(private activeStepService: ActiveStepService) { }

  ngOnInit(): void {
  }

  public setSelectedStep(step: IStepResponse) {
    this.activeStepService.setSelectedStep(step);
  }
}
