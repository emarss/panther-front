import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStockIssuesComponent } from './item-stock-issues.component';

describe('ItemStockIssuesComponent', () => {
  let component: ItemStockIssuesComponent;
  let fixture: ComponentFixture<ItemStockIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemStockIssuesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemStockIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
