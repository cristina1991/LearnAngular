import { TestBed } from '@angular/core/testing';

import { NavigationMockService } from './navigation-mock.service';

describe('NavigationMockService', () => {
  let service: NavigationMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
