import { TestBed } from '@angular/core/testing';

import { JoinDataService } from './join-data.service';

describe('JoinDataService', () => {
  let service: JoinDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoinDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
