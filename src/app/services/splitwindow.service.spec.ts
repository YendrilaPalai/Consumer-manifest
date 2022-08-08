import { TestBed } from '@angular/core/testing';

import { SplitwindowService } from './splitwindow.service';

describe('SplitwindowService', () => {
  let service: SplitwindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplitwindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
