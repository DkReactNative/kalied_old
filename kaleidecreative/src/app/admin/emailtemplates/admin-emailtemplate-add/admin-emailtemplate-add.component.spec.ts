import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailtemplateAddComponent } from './admin-emailtemplate-add.component';

describe('AdminEmailtemplateAddComponent', () => {
  let component: AdminEmailtemplateAddComponent;
  let fixture: ComponentFixture<AdminEmailtemplateAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmailtemplateAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmailtemplateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
