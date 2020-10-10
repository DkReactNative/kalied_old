import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerRootComponent } from './freelancer-root.component';

describe('FreelancerRootComponent', () => {
  let component: FreelancerRootComponent;
  let fixture: ComponentFixture<FreelancerRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
