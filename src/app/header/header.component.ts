import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  tokenResult = false;
 private tokenListner: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.tokenResult = this.authService.getTokenAuth();
    this.tokenListner = this.authService.getTokenauthListner()
    .subscribe((result) => {
      this.tokenResult = result;
    });
  }
  onLogout() {
    this.authService.logOut();
  }
  ngOnDestroy() {
    this.tokenListner.unsubscribe();
  }

}
