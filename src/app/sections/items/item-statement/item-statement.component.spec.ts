import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatementComponent } from './item-statement.component';

describe('ItemStatementComponent', () => {
  let component: ItemStatementComponent;
  let fixture: ComponentFixture<ItemStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemStatementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
