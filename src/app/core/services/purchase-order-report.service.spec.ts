import { TestBed } from '@angular/core/testing';

import { PurchaseOrderReportService } from './purchase-order-report.service';

describe('PurchaseOrderReportService', () => {
  let service: PurchaseOrderReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrderReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
