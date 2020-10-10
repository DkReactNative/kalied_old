import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientIndexComponent } from './admin-client-index.component';

describe('AdminClientIndexComponent', () => {
  let component: AdminClientIndexComponent;
  let fixture: ComponentFixture<AdminClientIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClientIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
