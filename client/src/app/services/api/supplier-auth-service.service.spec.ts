import { TestBed } from "@angular/core/testing";

import { SupplierAuthService } from "./supplier-auth-service.service";

describe("SupplierAuthService", () => {
  let service: SupplierAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierAuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
