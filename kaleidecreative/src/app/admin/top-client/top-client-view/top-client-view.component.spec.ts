import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopClientViewComponent } from './top-client-view.component';

describe('TopClientViewComponent', () => {
  let component: TopClientViewComponent;
  let fixture: ComponentFixture<TopClientViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopClientViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
