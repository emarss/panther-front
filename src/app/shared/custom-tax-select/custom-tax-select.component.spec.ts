import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTaxSelectComponent } from './custom-tax-select.component';

describe('CustomTaxSelectComponent', () => {
  let component: CustomTaxSelectComponent;
  let fixture: ComponentFixture<CustomTaxSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTaxSelectComponent]
    });
    fixture = TestBed.createComponent(CustomTaxSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
