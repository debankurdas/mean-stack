import { Router } from '@angular/router';
import { AuthData } from './auth.model';
import { HttpClient } from '@angular/common/http';
import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private route: Router) { }
  private userId: string;
  private token: string;
  private tokenAuth = false;
  private timer: any;
  private tokenAuthListner = new Subject<boolean>();
  private backEnd = environment.apiUril + '/users';
  getToken() {
    return this.token;
  }
  getTokenAuth() {
   return this.tokenAuth;
  }
  getTokenauthListner() {
    return this.tokenAuthListner.asObservable();
  }
  getTimer(duration: number) {
    this.timer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  getCreatorId() {
    return this.userId;
  }
  autoAuth() {
    const allAuthData = this.getAuthTokenandExpiresTime();
    if (!allAuthData) {
      return;
    }
    const now = new Date();
    const expiresTime = allAuthData.expireDate.getTime() - now.getTime();
    if (expiresTime > 0) {
      this.token = allAuthData.token;
      this.userId = allAuthData.userId;
      this.tokenAuth = true;
      this.getTimer(expiresTime / 1000);
      this.tokenAuthListner.next(true);
    }
  }

  createEmail(email: string, password: string) {
  const  authData: AuthData = {email, password};
  this.http.post(this.backEnd + '/signup', authData)
  .subscribe(() => {
    this.route.navigate(['/']);
  }, error => {
    this.tokenAuthListner.next(false);
  });
  }
  loginEmail(email: string, password: string) {
    const  authData: AuthData = {email, password};
    this.http.post<{token: string, expiresIn: number, uId: string}>(this.backEnd + '/login', authData)
    .subscribe((response) => {
      console.log(response);
      const token = response.token;
      this.token = token;
      if (token) {
        const expireTime = response.expiresIn;
        this.getTimer(expireTime);
        this.tokenAuth = true;
        this.userId = response.uId;
        this.tokenAuthListner.next(this.tokenAuth);
        const now = new Date();
        const expireDate = new Date(now.getTime() +  expireTime * 1000);
        console.log(expireDate);
        this.saveAuth(token, expireDate, this.userId);
        this.route.navigate(['/']);
      }
    }, error => {
      this.tokenAuthListner.next(false);
    });

  }
  logOut() {
    this.token = null;
    this.tokenAuth = false;
    this.tokenAuthListner.next(this.tokenAuth);
    this.userId = null;
    clearTimeout(this.timer);
    this.removeAuth();
    this.route.navigate(['/']);
  }

  saveAuth(token: string, expiresDate: Date , userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('Expiration', expiresDate.toISOString());
    localStorage.setItem('USERID:', userId);
  }

  removeAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('Expiration');
    localStorage.removeItem('USERID:');
  }
  getAuthTokenandExpiresTime() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('Expiration');
    const userId = localStorage.getItem('USERID:');
    if (!token || !expiresIn) {
      return;
    }
    return {
      token,
      expireDate : new Date(expiresIn),
      userId
    };
  }

}
