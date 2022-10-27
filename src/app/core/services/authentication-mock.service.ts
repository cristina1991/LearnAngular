import { Injectable } from '@angular/core';
import { AuthenticationService } from '../core.interface';
import { of } from 'rxjs';
import { accessTokenMock, userEmailMock } from '../core.mocks';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationMockService implements AuthenticationService {
  constructor() {}

  getUserEmail() {
    return of(userEmailMock);
  }

  getAccessToken() {
    return of(accessTokenMock);
  }
}
