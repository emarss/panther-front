import { TestBed } from '@angular/core/testing';

import { UserSavedService } from './user-saved.service';

describe('UserSavedService', () => {
  let service: UserSavedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSavedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
