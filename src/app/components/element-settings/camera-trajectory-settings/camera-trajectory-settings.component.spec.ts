import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraTrajectorySettingsComponent } from './camera-trajectory-settings.component';

describe('CameraTrajectorySettingsComponent', () => {
  let component: CameraTrajectorySettingsComponent;
  let fixture: ComponentFixture<CameraTrajectorySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraTrajectorySettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraTrajectorySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
