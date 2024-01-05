import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertedFromDefaultCurrencyComponent } from './converted-from-default-currency.component';

describe('ConvertedFromDefaultCurrencyComponent', () => {
  let component: ConvertedFromDefaultCurrencyComponent;
  let fixture: ComponentFixture<ConvertedFromDefaultCurrencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvertedFromDefaultCurrencyComponent]
    });
    fixture = TestBed.createComponent(ConvertedFromDefaultCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
