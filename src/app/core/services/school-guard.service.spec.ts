import { TestBed } from '@angular/core/testing';

import { SchoolGuardService } from './school-guard.service';

describe('SchoolGuardService', () => {
  let service: SchoolGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
