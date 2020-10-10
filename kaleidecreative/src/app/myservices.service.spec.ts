import { TestBed } from '@angular/core/testing';

import { MyservicesService } from './myservices.service';

describe('MyservicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyservicesService = TestBed.get(MyservicesService);
    expect(service).toBeTruthy();
  });
});
