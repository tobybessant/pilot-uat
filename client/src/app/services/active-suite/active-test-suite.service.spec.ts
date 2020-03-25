import { TestBed } from "@angular/core/testing";

import { ActiveTestSuiteService } from "./active-test-suite.service";

describe("ActiveSuiteService", () => {
  let service: ActiveTestSuiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveTestSuiteService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
