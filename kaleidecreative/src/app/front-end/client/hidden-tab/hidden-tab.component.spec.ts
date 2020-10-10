import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenTabComponent } from './hidden-tab.component';

describe('HiddenTabComponent', () => {
  let component: HiddenTabComponent;
  let fixture: ComponentFixture<HiddenTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
