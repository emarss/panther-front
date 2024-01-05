import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverduePurchaseOrdersComponent } from './overdue-purchase-orders.component';

describe('OverduePurchaseOrdersComponent', () => {
  let component: OverduePurchaseOrdersComponent;
  let fixture: ComponentFixture<OverduePurchaseOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverduePurchaseOrdersComponent],
    });
    fixture = TestBed.createComponent(OverduePurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
