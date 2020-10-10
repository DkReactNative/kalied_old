import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailtemplateIndexComponent } from './admin-emailtemplate-index.component';

describe('AdminEmailtemplateIndexComponent', () => {
  let component: AdminEmailtemplateIndexComponent;
  let fixture: ComponentFixture<AdminEmailtemplateIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmailtemplateIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmailtemplateIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
