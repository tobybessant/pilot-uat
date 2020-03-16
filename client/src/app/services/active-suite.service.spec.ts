import { TestBed } from "@angular/core/testing";

import { ActiveSuiteService } from "./active-suite.service";

describe("ActiveSuiteService", () => {
  let service: ActiveSuiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveSuiteService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
