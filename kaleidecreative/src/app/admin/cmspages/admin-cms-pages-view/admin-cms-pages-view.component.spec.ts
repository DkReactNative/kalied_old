import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCmsPagesViewComponent } from './admin-cms-pages-view.component';

describe('AdminCmsPagesViewComponent', () => {
  let component: AdminCmsPagesViewComponent;
  let fixture: ComponentFixture<AdminCmsPagesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCmsPagesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCmsPagesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
