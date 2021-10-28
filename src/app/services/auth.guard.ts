import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('sign_in')

    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      console.log('Надо авторизовать')
      // this.auth.logout()
      this.router.navigate(['/sign_in'])
      // return false
    }

  }
}
