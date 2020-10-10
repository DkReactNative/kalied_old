import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCmsPagesAddComponent } from './admin-cms-pages-add.component';

describe('AdminCmsPagesAddComponent', () => {
  let component: AdminCmsPagesAddComponent;
  let fixture: ComponentFixture<AdminCmsPagesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCmsPagesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCmsPagesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
