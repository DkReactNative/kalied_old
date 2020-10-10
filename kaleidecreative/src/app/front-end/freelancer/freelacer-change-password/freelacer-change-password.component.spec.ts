import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerChangePasswordComponent } from './freelacer-change-password.component';

describe('FreelacerChangePasswordComponent', () => {
  let component: FreelacerChangePasswordComponent;
  let fixture: ComponentFixture<FreelacerChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
