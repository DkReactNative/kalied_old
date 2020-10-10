import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailtemplateViewComponent } from './admin-emailtemplate-view.component';

describe('AdminEmailtemplateViewComponent', () => {
  let component: AdminEmailtemplateViewComponent;
  let fixture: ComponentFixture<AdminEmailtemplateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmailtemplateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmailtemplateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
