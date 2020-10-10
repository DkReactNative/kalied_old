import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectDescriptionTabComponent } from './client-project-description-tab.component';

describe('ClientProjectDescriptionTabComponent', () => {
  let component: ClientProjectDescriptionTabComponent;
  let fixture: ComponentFixture<ClientProjectDescriptionTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProjectDescriptionTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProjectDescriptionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
