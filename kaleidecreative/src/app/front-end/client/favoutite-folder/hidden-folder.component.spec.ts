import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteFolderComponent } from './hidden-folder.component'

describe('FavouriteFolderComponent', () => {
  let component: FavouriteFolderComponent;
  let fixture: ComponentFixture<FavouriteFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
