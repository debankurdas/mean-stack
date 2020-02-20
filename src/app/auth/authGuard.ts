import { AuthService } from './auth.service';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private route: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  boolean|Observable<boolean> | Promise<boolean> {
      const authVerification = this.authService.getTokenAuth();
      console.log(authVerification);
      if (!authVerification) {
        this.route.navigate(['/login']);
      }
      return authVerification;
  }
}
