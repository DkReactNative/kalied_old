import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerSkillAndAwardsComponent } from './freelacer-skill-and-awards.component';

describe('FreelacerSkillAndAwardsComponent', () => {
  let component: FreelacerSkillAndAwardsComponent;
  let fixture: ComponentFixture<FreelacerSkillAndAwardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerSkillAndAwardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerSkillAndAwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
