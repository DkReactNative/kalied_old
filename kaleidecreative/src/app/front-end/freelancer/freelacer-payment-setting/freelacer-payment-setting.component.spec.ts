import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerPaymentSettingComponent } from './freelacer-payment-setting.component';

describe('FreelacerPaymentSettingComponent', () => {
  let component: FreelacerPaymentSettingComponent;
  let fixture: ComponentFixture<FreelacerPaymentSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerPaymentSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerPaymentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
