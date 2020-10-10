import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifOtpComponent } from './verif-otp.component';

describe('VerifOtpComponent', () => {
  let component: VerifOtpComponent;
  let fixture: ComponentFixture<VerifOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
