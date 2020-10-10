import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectPaymentTabComponent } from './client-project-payment-tab.component';

describe('ClientProjectPaymentTabComponent', () => {
  let component: ClientProjectPaymentTabComponent;
  let fixture: ComponentFixture<ClientProjectPaymentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectPaymentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectPaymentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
