import {
  AuthenticationService,
  TenantManagementService,
} from './core/core.interface';

declare global {
  interface Window {
    inRuleServices: {
      authenticationService: AuthenticationService;
      navigationService: unknown;
      tenantManagementService: TenantManagementService;
    };
  }
}
