import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersDueTodayComponent } from './purchase-orders-due-today.component';

describe('PurchaseOrdersDueTodayComponent', () => {
  let component: PurchaseOrdersDueTodayComponent;
  let fixture: ComponentFixture<PurchaseOrdersDueTodayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseOrdersDueTodayComponent],
    });
    fixture = TestBed.createComponent(PurchaseOrdersDueTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
