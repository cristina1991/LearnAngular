import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AUTHENTICATION_SERVICE_TOKEN } from '../core.const';
import { combineLatest, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService, RuleApp } from '../core.interface';
import { createLabelsMock, createRuleAppsMock } from '../core.mocks';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  static catalogApiUrl = `${environment.apiUrl}/CatalogServiceWebHelper`;
  constructor(
    private httpClient: HttpClient,
    @Inject(AUTHENTICATION_SERVICE_TOKEN)
    private authenticationService: AuthenticationService
  ) {}

  getRuleAppInfo = (catalogUri: string) => {
    return combineLatest([
      this.authenticationService.getUserEmail(),
      this.authenticationService.getAccessToken(),
    ]).pipe(
      switchMap(([userEmail, userJwt]) => {
        if (environment.mockApi) {
          return of(createRuleAppsMock(catalogUri));
        }
        return this.httpClient.post<RuleApp[]>(CatalogService.catalogApiUrl, {
          UserEmailAddress: userEmail,
          UserJWT: userJwt,
          CatalogURI: catalogUri,
          RequestType: 'GetRuleAppInfo',
        });
      })
    );
  };

  getLabels = (catalogUri: string) => {
    return combineLatest([
      this.authenticationService.getUserEmail(),
      this.authenticationService.getAccessToken(),
    ]).pipe(
      switchMap(([userEmail, userJwt]) => {
        if (environment.mockApi) {
          return of(createLabelsMock(catalogUri));
        }
        return this.httpClient.post<string[]>(CatalogService.catalogApiUrl, {
          UserEmailAddress: userEmail,
          UserJWT: userJwt,
          CatalogURI: catalogUri,
          RequestType: 'GetLabels',
        });
      })
    );
  };

  applyLabel = (payload: any) => {
    return combineLatest([
      this.authenticationService.getUserEmail(),
      this.authenticationService.getAccessToken(),
    ]).pipe(
      switchMap(([userEmail, userJwt]) => {
        if (environment.mockApi) {
          return of(createLabelsMock(payload.catalog));
        }
        return this.httpClient.post<string[]>(CatalogService.catalogApiUrl, {
          UserEmailAddress: userEmail,
          UserJWT: userJwt,
          CatalogURI: payload.catalog,
          RequestType: 'ApplyLabel',
          RuleAppName: payload.ruleApp,
          RevisionToLabel: payload.revision,
          LabelToApply: payload.label,
        });
      })
    );
  };
}
