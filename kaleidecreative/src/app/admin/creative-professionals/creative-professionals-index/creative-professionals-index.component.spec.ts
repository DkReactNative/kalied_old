import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeProfessionalsIndexComponent } from './creative-professionals-index.component';

describe('CreativeProfessionalsIndexComponent', () => {
  let component: CreativeProfessionalsIndexComponent;
  let fixture: ComponentFixture<CreativeProfessionalsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeProfessionalsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeProfessionalsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
