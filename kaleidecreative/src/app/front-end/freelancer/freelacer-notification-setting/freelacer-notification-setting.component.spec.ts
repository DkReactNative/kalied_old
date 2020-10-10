import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerNotificationSettingComponent } from './freelacer-notification-setting.component';

describe('FreelacerNotificationSettingComponent', () => {
  let component: FreelacerNotificationSettingComponent;
  let fixture: ComponentFixture<FreelacerNotificationSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerNotificationSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerNotificationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
