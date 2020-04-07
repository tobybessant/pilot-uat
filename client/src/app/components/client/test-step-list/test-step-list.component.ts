import { Component, OnInit, Input } from "@angular/core";
import { IStepResponse } from "src/app/models/api/response/client/step.interface";

@Component({
  selector: "app-test-step-list-client",
  templateUrl: "./test-step-list.component.html",
  styleUrls: ["./test-step-list.component.scss"]
})
export class ClientTestStepListComponent implements OnInit {

  @Input()
  public steps: IStepResponse[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
