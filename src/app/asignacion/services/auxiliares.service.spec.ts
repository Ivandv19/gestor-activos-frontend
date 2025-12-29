import { TestBed } from '@angular/core/testing';

import { AuxiliaresService } from './auxiliares.service';

describe('AuxiliaresService', () => {
  let service: AuxiliaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuxiliaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
