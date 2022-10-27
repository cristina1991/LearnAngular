import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { filter, Observable, of, switchMap } from 'rxjs';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  TENANT_MANAGEMENT_SERVICE_TOKEN,
} from '../../core/core.const';
import {
  AuthenticationService,
  Catalog,
  Revision,
  RuleApp,
  TenantManagementService,
} from '../../core/core.interface';
import { CatalogService } from '../../core/services/catalog.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  form = this.fb.group({
    catalog: null,
    ruleApp: null,
    revision: null,
    existingLabel: null,
    newLabel: null,
  });

  catalogs$ = new Observable<Catalog[]>();
  ruleApps$ = new Observable<RuleApp[]>();
  revisions$ = new Observable<Revision[]>();
  labels$ = new Observable<string[]>();
  userEmail$ = this.authenticationService.getUserEmail();
  accessToken$ = this.authenticationService.getAccessToken();

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    @Inject(TENANT_MANAGEMENT_SERVICE_TOKEN)
    private tenantManagementService: TenantManagementService,
    @Inject(AUTHENTICATION_SERVICE_TOKEN)
    private authenticationService: AuthenticationService,
    private catalogService: CatalogService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
      // todo: initialize form values from params
    });

    this.catalogs$ = this.tenantManagementService.getTenantResources();

    this.labels$ = this.form.get('catalog')!.valueChanges.pipe(
      filter(Boolean),
      switchMap((catalogUri) => this.catalogService.getLabels(catalogUri))
    );

    this.ruleApps$ = this.form.get('catalog')!.valueChanges.pipe(
      filter(Boolean),
      switchMap((catalogUri) => this.catalogService.getRuleAppInfo(catalogUri))
    );

    this.revisions$ = this.form.get('ruleApp')!.valueChanges.pipe(
      filter(Boolean),
      switchMap((ruleApp: RuleApp) => {
        return of(ruleApp.revisions);
      })
    );
  }
}
