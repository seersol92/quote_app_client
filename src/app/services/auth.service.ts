import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import {environment} from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


const BASE_URL = environment.backendUrl;
@Injectable()
export class AuthService {
  domain: string =  BASE_URL;
  authToken;
  user;
  public isAdmin: Boolean = false;
  loggedinName: String = 'welcome';
  loggedInId: String = '';
  options;
  constructor(
    private http: Http
  ) {
    if (this.checkAdmin()) {
      this.isAdmin = true;
    }
  }

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
    return this.http.post(this.domain + '/authentication/register', user)
    .map(res => res.json())
    .catch(this.handleError);
  }
  loginUser(user) {
    return this.http.post(this.domain + '/authentication/login', user)
    .map(res => res.json())
    .catch(this.handleError);
  }
  checkUserName(username) {
    return this.http.get(this.domain + '/authentication/checkUserName/' + username)
    .map(res => res.json())
    .catch(this.handleError);
  }
  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email)
    .map(res => res.json())
    .catch(this.handleError);
  }
  postRequest(url, data) {
    return this.http.post(this.domain + url, data)
    .map(res => res.json())
    .catch(this.handleError);
  }
  getRequest(url, data) {
    return this.http.get(this.domain + url, data)
    .map(res => res.json())
    .catch(this.handleError);
  }
  /* LOGOUT USER
   */
   logout() {
     this.authToken = null;
     this.user = null;
     localStorage.clear();
   }

   loadCredentials(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    this.authToken = token;
    this.user = user;
  }

  getUserData(): any {
    this.loadCredentials();
    const jUser = JSON.parse(this.user);
    const jData = {token: this.authToken, user: jUser};
    return jData;
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
  getProfile(): Observable<any> {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options)
    .map(res => res.json())
    .catch(this.handleError);
  }

  public handleError (error: Response | any) {
    if (error.status === 0 ) {  // catch server error
          return Observable.throw(error);
    }
  }

  /*
   * Check if user logged in or not
   */
   isLoggedin() {
     return tokenNotExpired();
   }

   getloggedInInfo() {
    this.getProfile().subscribe(profile => {
      if (profile.user) {
       this.loggedinName = profile.user.username ;
       this.isAdmin = profile.user.is_admin;
       this.loggedInId = profile.user._id;
      }
     });
   }

   checkAdmin() {
      this.getProfile().subscribe(profile => {
     if (profile.user) {
       if (profile.user.is_admin) {
         return true;
       }
     }
   });
   return false;
  }
}
