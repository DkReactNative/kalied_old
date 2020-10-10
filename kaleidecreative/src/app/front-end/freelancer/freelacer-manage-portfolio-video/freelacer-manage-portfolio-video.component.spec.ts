import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelacerManagePortfolioVideoComponent } from './freelacer-manage-portfolio-video.component';

describe('FreelacerManagePortfolioVideoComponent', () => {
  let component: FreelacerManagePortfolioVideoComponent;
  let fixture: ComponentFixture<FreelacerManagePortfolioVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelacerManagePortfolioVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelacerManagePortfolioVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
