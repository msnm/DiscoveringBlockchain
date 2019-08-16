import { TestBed } from '@angular/core/testing';

import { EthService } from './eth.service';

describe('EthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EthService = TestBed.get(EthService);
    expect(service).toBeTruthy();
  });
});
