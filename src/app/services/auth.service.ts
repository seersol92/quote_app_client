import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  domain = 'https://mean-app2-seersol.c9users.io:8080';
  authToken;
  user;
  options;
  constructor(
    private http: Http
  ) { }

  /* only invoke this function any to attach any time
  *  with headers in order to authorize the user access
  */
  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers : new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  /* Load Token Fronm Browser Local Storage
  */
  loadToken() {
    const token =     localStorage.getItem('token');
    this.authToken = token;
  }

  registerUser(user) {
    return this.http.post(this.domain+'/authentication/register', user).map(res => res.json());
  }
  loginUser(user) {
    return this.http.post(this.domain+'/authentication/login', user).map(res => res.json());
  }
  checkUserName(username) {
    return this.http.get(this.domain+'/authentication/checkUserName/'+username).map(res => res.json());
  }
  checkEmail(email) {
    return this.http.get(this.domain+'/authentication/checkEmail/'+email).map(res => res.json());
  }
  /* LOGOUT USER
   */
   logout() {
     this.authToken = null;
     this.user= null;
     localStorage.clear();
   }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  /* @type: Get Profile of authenticated loggedin user
   *
   */
  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain+'/authentication/profile', this.options).map(res => res.json());
  }

  /*
   * Check if user logged in or not
   */
   isLoggedin() {
     return tokenNotExpired();
   }
}
