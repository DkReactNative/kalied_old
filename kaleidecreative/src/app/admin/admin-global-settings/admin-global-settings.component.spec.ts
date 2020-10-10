import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGlobalSettingsComponent } from './admin-global-settings.component';

describe('AdminGlobalSettingsComponent', () => {
  let component: AdminGlobalSettingsComponent;
  let fixture: ComponentFixture<AdminGlobalSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGlobalSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
