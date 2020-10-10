import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeatilPageComponent } from './project-deatil-page.component';

describe('ProjectDeatilPageComponent', () => {
  let component: ProjectDeatilPageComponent;
  let fixture: ComponentFixture<ProjectDeatilPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDeatilPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDeatilPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
