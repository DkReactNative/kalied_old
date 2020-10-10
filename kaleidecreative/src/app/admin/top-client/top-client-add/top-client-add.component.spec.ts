import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopClientAddComponent } from './top-client-add.component';

describe('TopClientAddComponent', () => {
  let component: TopClientAddComponent;
  let fixture: ComponentFixture<TopClientAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopClientAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopClientAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
