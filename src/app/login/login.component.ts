import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formProcessing = false;
  previousUrl;
  messageClass;
  message;
  loginError = false;
  constructor( private fb: FormBuilder, private auth: AuthService, private router: Router, private authGuard: AuthGuard) {
   this.createLoginForm();
  }

  loginUser() {
    const user = {
        loginUser : this.loginForm.get('loginUser').value,
        password:  this.loginForm.get('password').value
    };
    this.formProcessing = true;
    this.auth.loginUser(user).subscribe(data => {
      if (!data.success) {
          this.formProcessing = false;
          this.loginError = true;
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
      }else {
          this.messageClass = 'alert alert-success';
          this.message = 'Logged In Redirecting...';
          this.auth.storeUserData(data.token, data.user);
          setTimeout(() => {
            this.auth.loggedinName = data.user.username;
            this.auth.loggedInId = data.user.loggedId;
            this.auth.isAdmin = data.user.isadmin;
            console.log(this.auth.loggedInId);
            console.log(this.auth.isAdmin);
            if (this.previousUrl) {
              this.router.navigate([this.previousUrl]);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 2000); // redirect after 2 sec
      }
    });
  }
  createLoginForm() {
    this.loginForm = this.fb.group({
      loginUser: [null, Validators.compose([Validators.required])],
      password:  [null, Validators.compose([Validators.required])]
    });
  }
  ngOnInit() {
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger';
      this.message = 'You must be logged in to access that page.';
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }
}
