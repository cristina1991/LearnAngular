import { TestBed } from '@angular/core/testing';

import { TenantManagementMockService } from './tenant-management-mock.service';

describe('TenantManagementMockService', () => {
  let service: TenantManagementMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantManagementMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
