import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateFieldComponent } from './exchange-rate-field.component';

describe('ExchangeRateFieldComponent', () => {
  let component: ExchangeRateFieldComponent;
  let fixture: ComponentFixture<ExchangeRateFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangeRateFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExchangeRateFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
