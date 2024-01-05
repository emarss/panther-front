import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderShowMenuComponent } from './purchase-order-show-menu.component';

describe('PurchaseOrderShowMenuComponent', () => {
  let component: PurchaseOrderShowMenuComponent;
  let fixture: ComponentFixture<PurchaseOrderShowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderShowMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
