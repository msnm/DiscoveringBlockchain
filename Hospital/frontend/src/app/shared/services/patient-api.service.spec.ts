import { TestBed } from '@angular/core/testing';

import { PatientApiService } from './patient-api.service';

describe('PatientApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PatientApiService = TestBed.get(PatientApiService);
    expect(service).toBeTruthy();
  });
});
