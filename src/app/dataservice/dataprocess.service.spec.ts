import { TestBed } from '@angular/core/testing';

import { DataprocessService } from './dataprocess.service';

describe('DataprocessService', () => {
  let service: DataprocessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataprocessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
