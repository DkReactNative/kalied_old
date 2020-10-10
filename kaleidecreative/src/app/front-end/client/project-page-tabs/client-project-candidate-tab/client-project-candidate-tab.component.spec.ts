import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectCandidateTabComponent } from './client-project-candidate-tab.component';

describe('ClientProjectCandidateTabComponent', () => {
  let component: ClientProjectCandidateTabComponent;
  let fixture: ComponentFixture<ClientProjectCandidateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectCandidateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectCandidateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
