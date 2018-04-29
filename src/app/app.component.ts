import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public chatPanel: Boolean = false;
  userName: string = null;
  isAdmin: Boolean = false;
  constructor(
    private router: Router,
    private _flashMessagesService: FlashMessagesService,
    private route: ActivatedRoute,
    private el: ElementRef,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    const  userData = this.auth.getUserData();
    this.userName = userData.user.username;
    this.isAdmin  = userData.user.isadmin;
    }

  logMeOut() {
    this.chatPanel = false;
    this.auth.logout();
    // flash message will be visible for 2 second
    this._flashMessagesService.show('You are logged out', { cssClass: 'alert-success', timeout: 2000 });
    this.router.navigate(['/login']);
  }

}
