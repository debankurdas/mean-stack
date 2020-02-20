import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
isLoading = false;
  constructor(private authService: AuthService) { }
  private authListner: Subscription;
  ngOnInit() {
   this.authListner = this.authService.getTokenauthListner()
    .subscribe(authStatus => this.isLoading = false);
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createEmail(form.value.email, form.value.password);

  }

  ngOnDestroy() {
    this.authListner.unsubscribe();
  }
}
