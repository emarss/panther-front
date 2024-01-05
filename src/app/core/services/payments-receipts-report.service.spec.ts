import { TestBed } from '@angular/core/testing';

import { PaymentsReceiptsReportService } from './payments-receipts-report.service';

describe('PaymentsReceiptsReportService', () => {
  let service: PaymentsReceiptsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsReceiptsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
