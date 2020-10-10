import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectMessageTabComponent } from './client-project-message-tab.component';

describe('ClientProjectMessageTabComponent', () => {
  let component: ClientProjectMessageTabComponent;
  let fixture: ComponentFixture<ClientProjectMessageTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectMessageTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectMessageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
