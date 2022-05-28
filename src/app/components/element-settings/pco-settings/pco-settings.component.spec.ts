import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcoSettingsComponent } from './pco-settings.component';

describe('PcSettingsComponent', () => {
  let component: PcoSettingsComponent;
  let fixture: ComponentFixture<PcoSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcoSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
