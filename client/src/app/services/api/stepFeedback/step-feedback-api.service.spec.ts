import { TestBed } from "@angular/core/testing";

import { StepFeedbackApiService } from "./step-feedback-api.service";

describe("StepFeedbackApiService", () => {
  let service: StepFeedbackApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepFeedbackApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
