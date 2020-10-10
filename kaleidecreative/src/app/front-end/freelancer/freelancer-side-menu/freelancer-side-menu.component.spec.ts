import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerSideMenuComponent } from './freelancer-side-menu.component';

describe('FreelancerSideMenuComponent', () => {
  let component: FreelancerSideMenuComponent;
  let fixture: ComponentFixture<FreelancerSideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
