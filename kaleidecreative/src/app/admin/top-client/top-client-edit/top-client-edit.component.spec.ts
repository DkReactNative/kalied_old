import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopClientEditComponent } from './top-client-edit.component';

describe('TopClientEditComponent', () => {
  let component: TopClientEditComponent;
  let fixture: ComponentFixture<TopClientEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopClientEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopClientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
