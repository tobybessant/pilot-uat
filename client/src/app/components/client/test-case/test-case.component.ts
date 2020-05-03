import { Component, OnInit, Input } from "@angular/core";
import { ICaseResponse } from "src/app/models/api/response/client/case.interface";
import { IStepResponse } from "src/app/models/api/response/client/step.interface";
import { StepApiService } from "src/app/services/api/step/step-api.service";
import { ActiveStepService } from "src/app/services/active-step/active-step.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-test-case-client",
  templateUrl: "./test-case.component.html",
  styleUrls: ["./test-case.component.scss"]
})
export class ClientTestCaseComponent implements OnInit {

  @Input()
  public case: ICaseResponse;

  public steps: IStepResponse[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stepApiService: StepApiService,
    private activeStepService: ActiveStepService
  ) { }

  async ngOnInit(): Promise<void> {
    this.activeStepService.getStepUpdatedSubject().subscribe(async () => {
      await this.fetchStepsForCase();
    });

    await this.fetchStepsForCase();
  }

  public async fetchStepsForCase() {
    const response = await this.stepApiService.getStepsforCase<IStepResponse[]>(this.case.id);
    this.steps = response.payload;
  }

  public startTests(id: string): void {
    this.router.navigate(["case", id], { relativeTo: this.route });
  }
}
