import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGroupShowMenuComponent } from './item-group-show-menu.component';

describe('ItemGroupShowMenuComponent', () => {
  let component: ItemGroupShowMenuComponent;
  let fixture: ComponentFixture<ItemGroupShowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemGroupShowMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemGroupShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
