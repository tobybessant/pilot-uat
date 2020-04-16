import { Component, OnInit, Input } from "@angular/core";
import { StepFeedbackApiService } from "src/app/services/api/stepFeedback/step-feedback-api.service";
import { ActivatedRoute } from "@angular/router";
import { ProjectApiService } from "src/app/services/api/project/project-api.service";
import { IProjectResponse } from "src/app/models/api/response/supplier/project.interface";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.scss"]
})
export class ResultsComponent implements OnInit {

  /*
  public steps: any = [
    {
      id: "5",
      description: "Step 1"
    },
    {
      id: "6",
      description: "Step 2"
    },
    {
      id: "7",
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
    {
      email: "j@me.com",
      name: "John",
      feedback: [
        {
          stepId: "6",
          status: { label: "Passed" }
        }
      ]
    },
    {
      name: "Wayne",
      mail: "w@me.com",
      feedback: [
        {
          stepId: "5",
          status: { label: "Failed" }
        },
        {
          stepId: "6",
          status: { label: "Passed" }
        }
      ]
    },
    { name: "Patricia", email: "p@me.com" },
    { name: "John", email: "j2@me.com" },
  ];

  */

  @Input()
  private projectId: string;

  public clients: any[] = [];
  public project: IProjectResponse;

  constructor(
    private feedbackApiService: StepFeedbackApiService,
    private projectsApiService: ProjectApiService
  ) { }

  async ngOnInit(): Promise<void> {
    const projectFeedbackPerUser = await this.feedbackApiService.getAllFeedbackForProject(this.projectId);
    this.clients = projectFeedbackPerUser.payload;

    this.project = (await this.projectsApiService.getProjectById(this.projectId, true)).payload;
  }

  public getClientFeedbackStatusForStep(client: any, step: any) {
    const user = this.clients.find(c => c.email === client.email);
    if (user?.feedback) {
      const feedback = user.feedback[step.id];
      // console.log(feedback);
      if (feedback) {
        return feedback.status;
      }
    }
    return { label: "Not Started" };
  }
}
