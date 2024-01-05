import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxShowMenuComponent } from './tax-show-menu.component';

describe('TaxShowMenuComponent', () => {
  let component: TaxShowMenuComponent;
  let fixture: ComponentFixture<TaxShowMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxShowMenuComponent],
    });
    fixture = TestBed.createComponent(TaxShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
