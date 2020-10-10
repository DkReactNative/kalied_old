import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerMydetailsComponent } from './freelacer-mydetails.component';

describe('FreelacerMydetailsComponent', () => {
  let component: FreelacerMydetailsComponent;
  let fixture: ComponentFixture<FreelacerMydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerMydetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerMydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
