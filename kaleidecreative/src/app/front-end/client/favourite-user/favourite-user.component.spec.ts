import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteUserComponent } from './favourite-user.component';

describe('FavouriteUserComponent', () => {
  let component: FavouriteUserComponent;
  let fixture: ComponentFixture<FavouriteUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
