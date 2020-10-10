import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSideMenuComponent } from './profile-side-menu.component';

describe('ProfileSideMenuComponent', () => {
  let component: ProfileSideMenuComponent;
  let fixture: ComponentFixture<ProfileSideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
