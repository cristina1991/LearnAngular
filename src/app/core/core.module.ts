import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  NAVIGATION_SERVICE_TOKEN,
  TENANT_MANAGEMENT_SERVICE_TOKEN,
} from './core.const';
import { TenantManagementMockService } from './services/tenant-management-mock.service';
import { AuthenticationMockService } from './services/authentication-mock.service';
import { NavigationMockService } from './services/navigation-mock.service';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: AUTHENTICATION_SERVICE_TOKEN,
      useValue: environment.mockInRuleService
        ? new AuthenticationMockService()
        : window.inRuleServices?.authenticationService,
    },
    {
      provide: NAVIGATION_SERVICE_TOKEN,
      useValue: environment.mockInRuleService
        ? new NavigationMockService()
        : window.inRuleServices?.navigationService,
    },
    {
      provide: TENANT_MANAGEMENT_SERVICE_TOKEN,
      useValue: environment.mockInRuleService
        ? new TenantManagementMockService()
        : window.inRuleServices?.tenantManagementService,
    },
  ],
})
export class CoreModule {}
