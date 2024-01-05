import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingOverlayFullComponent } from './loading-overlay-full.component';

describe('LoadingOverlayFullComponent', () => {
  let component: LoadingOverlayFullComponent;
  let fixture: ComponentFixture<LoadingOverlayFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingOverlayFullComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoadingOverlayFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
