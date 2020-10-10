import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSettingComponent } from './payment-setting.component';

describe('PaymentSettingComponent', () => {
  let component: PaymentSettingComponent;
  let fixture: ComponentFixture<PaymentSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
