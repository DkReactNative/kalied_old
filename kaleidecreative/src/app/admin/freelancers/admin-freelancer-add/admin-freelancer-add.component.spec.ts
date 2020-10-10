import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFreelancerAddComponent } from './admin-freelancer-add.component';

describe('AdminFreelancerAddComponent', () => {
  let component: AdminFreelancerAddComponent;
  let fixture: ComponentFixture<AdminFreelancerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFreelancerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFreelancerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
