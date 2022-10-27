import { TestBed } from '@angular/core/testing';

import { AuthenticationMockService } from './authentication-mock.service';

describe('AuthenticationMockService', () => {
  let service: AuthenticationMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
