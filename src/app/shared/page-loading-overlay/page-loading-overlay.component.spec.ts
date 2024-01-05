import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoadingOverlayComponent } from './page-loading-overlay.component';

describe('PageLoadingOverlayComponent', () => {
  let component: PageLoadingOverlayComponent;
  let fixture: ComponentFixture<PageLoadingOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageLoadingOverlayComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageLoadingOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
