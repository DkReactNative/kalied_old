import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCmsPagesEditComponent } from './admin-cms-pages-edit.component';

describe('AdminCmsPagesEditComponent', () => {
  let component: AdminCmsPagesEditComponent;
  let fixture: ComponentFixture<AdminCmsPagesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCmsPagesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCmsPagesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
