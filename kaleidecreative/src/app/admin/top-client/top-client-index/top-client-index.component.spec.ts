import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopClientIndexComponent } from './top-client-index.component';

describe('TopClientIndexComponent', () => {
  let component: TopClientIndexComponent;
  let fixture: ComponentFixture<TopClientIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopClientIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopClientIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
