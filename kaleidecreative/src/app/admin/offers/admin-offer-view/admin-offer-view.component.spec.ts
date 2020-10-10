import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOfferViewComponent } from './admin-offer-view.component';

describe('AdminOfferViewComponent', () => {
  let component: AdminOfferViewComponent;
  let fixture: ComponentFixture<AdminOfferViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOfferViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOfferViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
