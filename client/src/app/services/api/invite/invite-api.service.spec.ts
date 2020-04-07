import { TestBed } from "@angular/core/testing";

import { InviteApiService } from "./invite-api.service";

describe("InviteApiService", () => {
  let service: InviteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
