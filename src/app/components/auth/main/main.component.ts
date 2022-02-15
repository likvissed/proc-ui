import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { AuthHelper } from '@iss/ng-auth-center';

import { LoadingService } from './../../../services/loading.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private authHelper: AuthHelper,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  loading: boolean = false;

  isAuthenticated

  fio_initials
  access_to_chancellery
  access_to_duties

  ngOnInit(): void {
    this.loadingService.isLoading$.subscribe(value =>{
      this.loading = value;

      // Для запуска обнаружения изменений
      this.cdr.detectChanges();
    });

    this.authHelper.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth

      if (isAuth) {
        this.fio_initials = this.authHelper.getJwtPayload()['fio_initials']
        this.access_to_chancellery = this.authHelper.getJwtPayload()['access_to_chancellery']
        this.access_to_duties = this.authHelper.getJwtPayload()['access_to_duties']
      }
    });
  }

  logout() {
    this.authHelper.logout();
  }

}
