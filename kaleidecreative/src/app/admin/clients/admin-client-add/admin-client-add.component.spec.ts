import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientAddComponent } from './admin-client-add.component';

describe('AdminClientAddComponent', () => {
  let component: AdminClientAddComponent;
  let fixture: ComponentFixture<AdminClientAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClientAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
