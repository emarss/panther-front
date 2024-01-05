import { TestBed } from '@angular/core/testing';

import { ContactPersonService } from './contact-person.service';

describe('ContactPersonService', () => {
  let service: ContactPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
