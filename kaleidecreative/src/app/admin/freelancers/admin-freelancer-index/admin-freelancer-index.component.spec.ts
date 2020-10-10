import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFreelancerIndexComponent } from './admin-freelancer-index.component';

describe('AdminFreelancerIndexComponent', () => {
  let component: AdminFreelancerIndexComponent;
  let fixture: ComponentFixture<AdminFreelancerIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFreelancerIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFreelancerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
