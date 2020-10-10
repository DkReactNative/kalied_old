import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSetupSideMenuComponent } from './profile-setup-side-menu.component';

describe('ProfileSetupSideMenuComponent', () => {
  let component: ProfileSetupSideMenuComponent;
  let fixture: ComponentFixture<ProfileSetupSideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSetupSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSetupSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
