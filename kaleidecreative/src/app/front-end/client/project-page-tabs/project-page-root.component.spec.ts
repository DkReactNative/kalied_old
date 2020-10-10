import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectPageRootComponent } from "./project-page-root.component";

describe("ProjectPageRootComponent", () => {
  let component: ProjectPageRootComponent;
  let fixture: ComponentFixture<ProjectPageRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectPageRootComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPageRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
