import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCmsPagesIndexComponent } from './admin-cms-pages-index.component';

describe('AdminCmsPagesIndexComponent', () => {
  let component: AdminCmsPagesIndexComponent;
  let fixture: ComponentFixture<AdminCmsPagesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCmsPagesIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCmsPagesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
