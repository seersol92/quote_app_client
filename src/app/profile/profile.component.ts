import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  email;
  constructor( private auth: AuthService) { }

  ngOnInit() {
    this.auth.getProfile().subscribe(profile => {
      this.user = profile.user.username;
      this.email= profile.user.email
    });
  }

}
