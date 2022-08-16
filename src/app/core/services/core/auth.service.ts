import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '../../models/misc/token.model';

import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { WindowReferenceService } from './window.service';
import { UserService } from '../misc/user.service';
import { MinimalUser } from '../../models/db/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const API_BASE_URL = environment.api_url;
const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  windowReference: Window;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private storageService: StorageService,
    private userService: UserService,
    private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  login(code: string): Observable<Token> {
    return this.apiService.post('/auth/login/', { code: code });
  }

  getAccessToken(): string | null {
    const user: MinimalUser = this.userService.getUserProfile();

    return user ? user.access_token : null;
  }

  isLoggedIn() {
    return this.storageService.get('access_token') !== null;
  }

  logout() {
    this.storageService.clear();
  }

  redirectToLogin() {
    this.windowReference.location.href = FYLE_URL +
      '/app/developers/#/oauth/authorize?' +
      'client_id=' +
      FYLE_CLIENT_ID +
      '&redirect_uri=' +
      CALLBACK_URI +
      '&response_type=code';
  }

  switchWorkspace() {
    this.logout();
    this.redirectToLogin();
  }

  checkLoginStatusAndLogout(): void {
    if (this.isLoggedIn()) {
      this.logout();
    }
  }
}
