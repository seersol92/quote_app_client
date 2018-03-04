import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService
  ) { }
  ngOnInit() {
  }
  logMeOut() {
    this.auth.logout();
    // flash message will be visible for 2 second
    this._flashMessagesService.show('You are logged out', { cssClass: 'alert-success', timeout: 2000 });
    this.router.navigate(['/login']);
  }
}
