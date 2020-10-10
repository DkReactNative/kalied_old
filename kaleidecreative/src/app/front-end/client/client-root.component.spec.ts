import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRootComponent } from './client-root.component';

describe('ClientRootComponent', () => {
  let component: ClientRootComponent;
  let fixture: ComponentFixture<ClientRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
