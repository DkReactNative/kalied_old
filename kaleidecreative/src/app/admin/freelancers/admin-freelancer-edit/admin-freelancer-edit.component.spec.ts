import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFreelancerEditComponent } from './admin-freelancer-edit.component';

describe('AdminFreelancerEditComponent', () => {
  let component: AdminFreelancerEditComponent;
  let fixture: ComponentFixture<AdminFreelancerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFreelancerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFreelancerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
