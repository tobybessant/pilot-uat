import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-test-step-list",
  templateUrl: "./test-step-list.component.html",
  styleUrls: ["./test-step-list.component.scss"]
})
export class TestStepListComponent implements OnInit {

  @Input()
  public steps: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
