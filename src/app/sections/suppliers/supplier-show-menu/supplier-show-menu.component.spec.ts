import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierShowMenuComponent } from './supplier-show-menu.component';

describe('SupplierShowMenuComponent', () => {
  let component: SupplierShowMenuComponent;
  let fixture: ComponentFixture<SupplierShowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierShowMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
