import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerPaymentTabComponent } from './freelancer-payment-tab.component';

describe('FreelancerPaymentTabComponent', () => {
  let component: FreelancerPaymentTabComponent;
  let fixture: ComponentFixture<FreelancerPaymentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerPaymentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerPaymentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
