import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierContactPersonsComponent } from './supplier-contact-persons.component';

describe('SupplierContactPersonsComponent', () => {
  let component: SupplierContactPersonsComponent;
  let fixture: ComponentFixture<SupplierContactPersonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierContactPersonsComponent],
    });
    fixture = TestBed.createComponent(SupplierContactPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
