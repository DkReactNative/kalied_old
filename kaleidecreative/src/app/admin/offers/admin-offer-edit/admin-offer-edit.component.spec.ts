import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOfferEditComponent } from './admin-offer-edit.component';

describe('AdminOfferEditComponent', () => {
  let component: AdminOfferEditComponent;
  let fixture: ComponentFixture<AdminOfferEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOfferEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOfferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
