import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSettingComponent } from './element-setting.component';

describe('ElementSettingComponent', () => {
  let component: ElementSettingComponent;
  let fixture: ComponentFixture<ElementSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
