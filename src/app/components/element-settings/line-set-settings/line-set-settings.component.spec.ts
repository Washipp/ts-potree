import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSetSettingsComponent } from './line-set-settings.component';

describe('LineSetSettingsComponent', () => {
  let component: LineSetSettingsComponent;
  let fixture: ComponentFixture<LineSetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineSetSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
