import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserIndexComponent } from './admin-user-index.component';

describe('AdminUserIndexComponent', () => {
  let component: AdminUserIndexComponent;
  let fixture: ComponentFixture<AdminUserIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
