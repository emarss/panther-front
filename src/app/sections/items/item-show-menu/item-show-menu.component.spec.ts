import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemShowMenuComponent } from './item-show-menu.component';

describe('ItemShowMenuComponent', () => {
  let component: ItemShowMenuComponent;
  let fixture: ComponentFixture<ItemShowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemShowMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
