import { TestBed } from "@angular/core/testing";

import { ActiveStepService } from "./active-step.service";

describe("ActiveStepService", () => {
  let service: ActiveStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveStepService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
