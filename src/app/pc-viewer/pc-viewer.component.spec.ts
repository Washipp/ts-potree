import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcViewerComponent } from './pc-viewer.component';

describe('PcViewerComponent', () => {
  let component: PcViewerComponent;
  let fixture: ComponentFixture<PcViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
