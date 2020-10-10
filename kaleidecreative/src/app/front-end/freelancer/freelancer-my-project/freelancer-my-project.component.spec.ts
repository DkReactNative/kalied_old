import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerMyProjectComponent } from './freelancer-my-project.component';

describe('FreelancerMyProjectComponent', () => {
  let component: FreelancerMyProjectComponent;
  let fixture: ComponentFixture<FreelancerMyProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerMyProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerMyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
