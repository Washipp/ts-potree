import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPcSettingsComponent } from './default-pc-settings.component';

describe('DefaultPcSettingsComponent', () => {
  let component: DefaultPcSettingsComponent;
  let fixture: ComponentFixture<DefaultPcSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultPcSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPcSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
