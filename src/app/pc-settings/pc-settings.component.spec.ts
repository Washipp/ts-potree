import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcSettingsComponent } from './pc-settings.component';

describe('PcSettingsComponent', () => {
  let component: PcSettingsComponent;
  let fixture: ComponentFixture<PcSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
