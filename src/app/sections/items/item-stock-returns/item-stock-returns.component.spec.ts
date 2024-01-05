import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStockReturnsComponent } from './item-stock-returns.component';

describe('ItemStockReturnsComponent', () => {
  let component: ItemStockReturnsComponent;
  let fixture: ComponentFixture<ItemStockReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemStockReturnsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemStockReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
