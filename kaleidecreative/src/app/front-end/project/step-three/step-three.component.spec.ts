import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProjectStepThreeComponent } from "./step-three.component";

describe("StepThreeComponent", () => {
  let component: ProjectStepThreeComponent;
  let fixture: ComponentFixture<ProjectStepThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectStepThreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
