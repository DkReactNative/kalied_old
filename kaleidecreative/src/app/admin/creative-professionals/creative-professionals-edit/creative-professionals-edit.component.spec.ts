import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeProfessionalsEditComponent } from './creative-professionals-edit.component';

describe('CreativeProfessionalsEditComponent', () => {
  let component: CreativeProfessionalsEditComponent;
  let fixture: ComponentFixture<CreativeProfessionalsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeProfessionalsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeProfessionalsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
