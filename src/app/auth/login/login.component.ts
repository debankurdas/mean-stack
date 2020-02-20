import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }
  isLoading = false;
  private authListner: Subscription;
  ngOnInit() {
   this.authListner = this.authService.getTokenauthListner()
    .subscribe(authStatus => this.isLoading = false);
  }
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.loginEmail(form.value.email, form.value.password);
  }
  ngOnDestroy() {
    this.authListner.unsubscribe();
  }

}
