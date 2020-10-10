import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMyProjectComponent } from './client-my-project.component';

describe('ClientMyProjectComponent', () => {
  let component: ClientMyProjectComponent;
  let fixture: ComponentFixture<ClientMyProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMyProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
