import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClusterDomainWithToken, Token } from '../../models/misc/token.model';

import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { WindowService } from './window.service';
import { UserService } from '../misc/user.service';
import { MinimalUser } from '../../models/db/user.model';
import { WorkspaceService } from '../workspace/workspace.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  windowReference: Window;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private storageService: StorageService,
    private userService: UserService,
    private WindowService: WindowService,
    private workspaceService: WorkspaceService) {
    this.windowReference = this.WindowService.nativeWindow;
  }

  redirectToXeroOAuth(): void {
    this.windowReference.location.href = `${environment.xero_authorize_uri}?client_id=${environment.xero_client_id}&scope=${environment.xero_scope}&response_type=code&redirect_uri=${environment.xero_callback_uri}&state=${this.workspaceService.getWorkspaceId()}`;
  }

  redirectToFyleOAuth(): void {
    this.windowReference.location.href = `${environment.fyle_app_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
  }

  redirectToOnboardingLanding(): void {
    this.windowReference.location.href = `${environment.app_url}/workspaces/onboarding/landing`;
  }

  redirectToOnboardingLogin(): void {
    this.windowReference.location.href = `${environment.app_url}/auth/login`;
  }

  loginWithRefreshToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refreshToken });
  }

  getClusterDomainByCode(code: string): Observable<ClusterDomainWithToken> {
    return this.apiService.post('/auth/cluster_domain/', { code }, environment.cluster_domain_api_url);
  }

  login(code: string): Observable<Token> {
    return this.apiService.post('/auth/login/', { code: code });
  }

  getAccessToken(): string | null {
    const user: MinimalUser = this.userService.getUserProfile();

    return user ? user.access_token : null;
  }

  refreshAccessToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/refresh/', { refresh_token: refreshToken });
  }

  updateAccessToken(accessToken: string): string | null {
    const user: MinimalUser = this.userService.getUserProfile();

    if (user) {
      user.access_token = accessToken;
      this.userService.storeUserProfile(user);
      return accessToken;
    }

    return null;
  }

  getRefreshToken(): string | null {
    const user: MinimalUser = this.userService.getUserProfile();

    return user ? user.refresh_token : null;
  }

  isLoggedIn() {
    return this.userService.getUserProfile() !== null;
  }

  logout() {
    this.storageService.clear();
  }

  redirectToLogin() {
    this.windowReference.location.href = `${environment.fyle_app_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
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
