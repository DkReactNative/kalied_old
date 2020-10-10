import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyLinkComponent } from './verify-link.component';

describe('VerifyLinkComponent', () => {
  let component: VerifyLinkComponent;
  let fixture: ComponentFixture<VerifyLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
