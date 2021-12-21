import { Component, OnInit } from '@angular/core';

import { AuthHelper } from '@iss/ng-auth-center';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private authHelper: AuthHelper
  ) { }

  isAuthenticated

  fio_initials
  access_to_chancellery

  ngOnInit(): void {
    this.authHelper.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth

      if (isAuth) {
        this.fio_initials = this.authHelper.getJwtPayload()['fio_initials']
        this.access_to_chancellery = this.authHelper.getJwtPayload()['access_to_chancellery']
      }
    });
  }

  logout() {
    this.authHelper.logout();
  }

}
