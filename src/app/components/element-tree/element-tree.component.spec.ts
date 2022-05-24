import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementTreeComponent } from './element-tree.component';

describe('ElementTreeComponent', () => {
  let component: ElementTreeComponent;
  let fixture: ComponentFixture<ElementTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
