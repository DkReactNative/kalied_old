import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOfferAddComponent } from './admin-offer-add.component';

describe('AdminOfferAddComponent', () => {
  let component: AdminOfferAddComponent;
  let fixture: ComponentFixture<AdminOfferAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOfferAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOfferAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
