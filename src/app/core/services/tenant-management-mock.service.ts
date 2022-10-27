import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catalogsMock } from '../core.mocks';
import { TenantManagementService } from '../core.interface';

@Injectable({
  providedIn: 'root',
})
export class TenantManagementMockService implements TenantManagementService {
  constructor() {}

  getTenantResources() {
    return of(catalogsMock);
  }
}
