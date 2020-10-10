import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientViewComponent } from './admin-client-view.component';

describe('AdminClientViewComponent', () => {
  let component: AdminClientViewComponent;
  let fixture: ComponentFixture<AdminClientViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClientViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
