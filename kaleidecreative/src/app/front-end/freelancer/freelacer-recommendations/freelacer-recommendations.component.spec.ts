import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerRecommendationsComponent } from './freelacer-recommendations.component';

describe('FreelacerRecommendationsComponent', () => {
  let component: FreelacerRecommendationsComponent;
  let fixture: ComponentFixture<FreelacerRecommendationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerRecommendationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
