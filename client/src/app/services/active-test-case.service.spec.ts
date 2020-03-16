import { TestBed } from '@angular/core/testing';

import { ActiveTestCaseService } from './active-test-case.service';

describe('ActiveTestCaseService', () => {
  let service: ActiveTestCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveTestCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
