import { TestBed } from '@angular/core/testing';

import { PcoService } from './pco.service';

describe('PcoService', () => {
  let service: PcoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
