import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminForgotPasswordComponent } from './admin-forgot-password.component';

describe('AdminForgotPasswordComponent', () => {
  let component: AdminForgotPasswordComponent;
  let fixture: ComponentFixture<AdminForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
