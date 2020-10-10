import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFreelancerViewComponent } from './admin-freelancer-view.component';

describe('AdminFreelancerViewComponent', () => {
  let component: AdminFreelancerViewComponent;
  let fixture: ComponentFixture<AdminFreelancerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFreelancerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFreelancerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
