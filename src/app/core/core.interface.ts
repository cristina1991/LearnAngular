import { Observable } from 'rxjs';

export interface Catalog {
  name: string;
  uri: string;
}

export interface Revision {
  revision: string;
}

export interface RuleApp {
  name: string;

  revisions: Revision[];
}

export interface TenantManagementService {
  getTenantResources: () => Observable<Catalog[]>;
}

export interface AuthenticationService {
  getUserEmail: () => Observable<string>;
  getAccessToken: () => Observable<string>;
}
