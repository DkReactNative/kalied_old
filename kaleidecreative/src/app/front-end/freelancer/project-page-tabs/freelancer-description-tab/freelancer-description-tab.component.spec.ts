import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerDescriptionTabComponent } from './freelancer-description-tab.component';

describe('FreelancerDescriptionTabComponent', () => {
  let component: FreelancerDescriptionTabComponent;
  let fixture: ComponentFixture<FreelancerDescriptionTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerDescriptionTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerDescriptionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
