import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MinimalUser } from '../../core/models/db/user.model';
import { AuthService } from '../../core/services/core/auth.service';
import { UserService } from '../../core/services/misc/user.service';
import { ClusterDomainWithToken } from 'src/app/core/models/misc/token.model';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/core/services/core/storage.service';

@Component({
  selector: 'app-fyle-callback',
  templateUrl: './fyle-callback.component.html',
  styleUrls: ['./fyle-callback.component.scss']
})
export class FyleCallbackComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    private userService: UserService
  ) { }

  private redirectToLogin(): void {
    this.authService.logout();
    this.router.navigate(['auth/login']);
    this.snackBar.open(`You don't have administrator access to this page, please contact support@fylehq.com if you need further assistance on this`, '', {
      duration: 7000
    });
  }

  private saveUserProfileAndNavigate(code: string): void {
    this.authService.getClusterDomainByCode(code).subscribe((clusterDomainWithToken: ClusterDomainWithToken) => {
      this.storageService.set('cluster-domain', `${clusterDomainWithToken.cluster_domain}/${environment.production ? 'xero-api/api': 'api'}`);
      this.authService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe(response => {
        const user: MinimalUser = {
          'email': response.user.email,
          'access_token': response.access_token,
          'refresh_token': response.refresh_token,
          'full_name': response.user.full_name,
          'user_id': response.user.user_id,
          'org_id': response.user.org_id,
          'org_name': response.user.org_name
        };
        this.userService.storeUserProfile(user);
  
        this.router.navigate(['/workspaces']);
  
        // Store orgs count in background, need not be a sync call
        this.userService.storeFyleOrgsCount();
    });
    }, () => {
      this.redirectToLogin();
    });
  }

  private login(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.saveUserProfileAndNavigate(params.code);
      } else if (params.error) {
        this.redirectToLogin();
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();

    this.login();
  }

}
