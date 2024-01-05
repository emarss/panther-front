import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStatementComponent } from './inventory-statement.component';

describe('InventoryStatementComponent', () => {
  let component: InventoryStatementComponent;
  let fixture: ComponentFixture<InventoryStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryStatementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
