import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSideBarComponent } from './project-side-bar.component';

describe('ProjectSideBarComponent', () => {
  let component: ProjectSideBarComponent;
  let fixture: ComponentFixture<ProjectSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
