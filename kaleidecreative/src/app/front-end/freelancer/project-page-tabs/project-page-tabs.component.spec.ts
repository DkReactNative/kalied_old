import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPageTabsComponent } from './project-page-tabs.component';

describe('ProjectPageTabsComponent', () => {
  let component: ProjectPageTabsComponent;
  let fixture: ComponentFixture<ProjectPageTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPageTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
