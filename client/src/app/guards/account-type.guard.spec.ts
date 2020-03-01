import { TestBed } from "@angular/core/testing";

import { AccountTypeGuard } from "./account-type.guard";

describe("AccountTypeGuard", () => {
  let guard: AccountTypeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccountTypeGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
