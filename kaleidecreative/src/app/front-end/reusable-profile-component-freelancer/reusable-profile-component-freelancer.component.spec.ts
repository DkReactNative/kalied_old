import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableProfileComponentFreelancerComponent } from './reusable-profile-component-freelancer.component';

describe('ReusableProfileComponentFreelancerComponent', () => {
  let component: ReusableProfileComponentFreelancerComponent;
  let fixture: ComponentFixture<ReusableProfileComponentFreelancerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReusableProfileComponentFreelancerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReusableProfileComponentFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
