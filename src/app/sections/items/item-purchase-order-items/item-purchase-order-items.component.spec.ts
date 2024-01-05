import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPurchaseOrderItemsComponent } from './item-purchase-order-items.component';

describe('ItemPurchaseOrdersComponent', () => {
  let component: ItemPurchaseOrderItemsComponent;
  let fixture: ComponentFixture<ItemPurchaseOrderItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemPurchaseOrderItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemPurchaseOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
