import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailtemplateEditComponent } from './admin-emailtemplate-edit.component';

describe('AdminEmailtemplateEditComponent', () => {
  let component: AdminEmailtemplateEditComponent;
  let fixture: ComponentFixture<AdminEmailtemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmailtemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmailtemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
