import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeProfessionalsViewComponent } from './creative-professionals-view.component';

describe('CreativeProfessionalsViewComponent', () => {
  let component: CreativeProfessionalsViewComponent;
  let fixture: ComponentFixture<CreativeProfessionalsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeProfessionalsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeProfessionalsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
