import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerExpertiseLevelComponent } from './freelacer-expertise-level.component';

describe('FreelacerExpertiseLevelComponent', () => {
  let component: FreelacerExpertiseLevelComponent;
  let fixture: ComponentFixture<FreelacerExpertiseLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerExpertiseLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerExpertiseLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
