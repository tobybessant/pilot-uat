import { TestBed } from "@angular/core/testing";

import { StepApiService } from "./step-api.service";

describe("StepApiService", () => {
  let service: StepApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
