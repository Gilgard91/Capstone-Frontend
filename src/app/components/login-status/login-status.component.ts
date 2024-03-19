import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import Handlebars from 'handlebars';

import Backbone from 'backbone';

import Q from 'q';
import { UserDetailsService } from 'src/app/services/user-details.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFirstName: string = '';
  userEmail: string = '';
  storage: Storage = sessionStorage;
  isAdmin: boolean = false;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private userDetailsSrv: UserDetailsService
  ) {}

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe((res) => {
      this.isAuthenticated = res.isAuthenticated!;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((res) => {
        this.userFirstName = res.name as string;
        this.userEmail = res.email as string;
        this.userDetailsSrv.setUserEmail(this.userEmail);
        this.userDetailsSrv.setUserFirstName(this.userFirstName);
        this.storage.setItem('userEmail', this.userEmail);

        if (res.email === 'admin@epichw.com') {
          this.isAdmin = true;
        }
      });
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
