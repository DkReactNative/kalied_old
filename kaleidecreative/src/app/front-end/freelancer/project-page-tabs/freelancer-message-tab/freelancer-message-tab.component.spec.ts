import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerMessageTabComponent } from './freelancer-message-tab.component';

describe('FreelancerMessageTabComponent', () => {
  let component: FreelancerMessageTabComponent;
  let fixture: ComponentFixture<FreelancerMessageTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerMessageTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerMessageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
