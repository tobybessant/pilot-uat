import { TestBed } from "@angular/core/testing";

import { TestSuiteApiService } from "./test-suite-api.service";

describe("SuiteApiService", () => {
  let service: TestSuiteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestSuiteApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
