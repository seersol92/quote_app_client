import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAdmin: Boolean = false;
  constructor(
    private auth: AuthService
  ) { }
  ngOnInit() {
    this.auth.getProfile().subscribe(profile => {
      if (profile.user) {
        if (profile.user.is_admin) {
          this.isAdmin = true;
        }
      }
    });
  }

}
