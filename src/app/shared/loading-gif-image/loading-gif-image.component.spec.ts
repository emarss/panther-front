import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingGifImageComponent } from './loading-gif-image.component';

describe('LoadingGifImageComponent', () => {
  let component: LoadingGifImageComponent;
  let fixture: ComponentFixture<LoadingGifImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingGifImageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoadingGifImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
