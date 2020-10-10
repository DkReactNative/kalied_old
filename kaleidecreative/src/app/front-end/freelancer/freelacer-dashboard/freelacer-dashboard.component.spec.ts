import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerDashboardComponent } from './freelacer-dashboard.component';

describe('FreelacerDashboardComponent', () => {
  let component: FreelacerDashboardComponent;
  let fixture: ComponentFixture<FreelacerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
