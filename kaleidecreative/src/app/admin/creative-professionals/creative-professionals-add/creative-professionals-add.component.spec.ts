import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeProfessionalsAddComponent } from './creative-professionals-add.component';

describe('CreativeProfessionalsAddComponent', () => {
  let component: CreativeProfessionalsAddComponent;
  let fixture: ComponentFixture<CreativeProfessionalsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeProfessionalsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeProfessionalsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
