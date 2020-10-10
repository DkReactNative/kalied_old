import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOfferIndexComponent } from './admin-offer-index.component';

describe('AdminOfferIndexComponent', () => {
  let component: AdminOfferIndexComponent;
  let fixture: ComponentFixture<AdminOfferIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOfferIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOfferIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
