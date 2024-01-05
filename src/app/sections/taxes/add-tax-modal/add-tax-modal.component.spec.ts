import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxModalComponent } from './add-tax-modal.component';

describe('AddTaxModalComponent', () => {
  let component: AddTaxModalComponent;
  let fixture: ComponentFixture<AddTaxModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTaxModalComponent],
    });
    fixture = TestBed.createComponent(AddTaxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
