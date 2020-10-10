import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPasswordResetComponent } from './admin-password-reset.component';

describe('AdminPasswordResetComponent', () => {
  let component: AdminPasswordResetComponent;
  let fixture: ComponentFixture<AdminPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
