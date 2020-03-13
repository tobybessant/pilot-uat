import { TestBed } from '@angular/core/testing';

import { SuiteApiService } from './suite-api.service';

describe('SuiteApiService', () => {
  let service: SuiteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
