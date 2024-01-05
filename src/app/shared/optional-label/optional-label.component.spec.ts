import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalLabelComponent } from './optional-label.component';

describe('OptionalLabelComponent', () => {
  let component: OptionalLabelComponent;
  let fixture: ComponentFixture<OptionalLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionalLabelComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OptionalLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
