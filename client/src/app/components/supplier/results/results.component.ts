import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"]
})
export class ResultsComponent implements OnInit {

  public steps: any = [
    {
      description: "Step 1"
    },
    {
      description: "Step 2"
    },
    {
      description: "Step 3"
    }
  ];

  public suites: any = [{
    name: "suite1",
    cases: [
      {
        name: "Case 1",
        steps: this.steps
      },
      {
        name: "Case 2",
        steps: this.steps
      },
      {
        name: "Case 6",
        steps: this.steps
      }
      ,
      {
        name: "Case 6",
        steps: this.steps
      },
      {
        name: "Case 6",
        steps: this.steps
      }
    ]
  },
  {
    name: "suite222±±",
    cases: [
      {
        name: "Case 6",
        steps: this.steps
      },
      {
        name: "Case 6",
        steps: this.steps
      },
      {
        name: "Case 6",
        steps: this.steps
      }
    ]
  }];
  public clients: any = [
    { name: "John" },
    { name: "Wayne" },
    { name: "Patricia" },
    { name: "John" },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public getClientFeedbackStatusForStep(step: any) {
    return { label: "Not Started" };
  }
}
