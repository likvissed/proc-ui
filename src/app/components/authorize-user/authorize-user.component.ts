import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthCenter } from 'src/app/services/auth-center.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authorize-user',
  templateUrl: './authorize-user.component.html',
  styleUrls: ['./authorize-user.component.scss']
})
export class AuthorizeUserComponent implements OnInit {

  constructor(
    private router: Router,
    private authCenter: AuthCenter
  ) { }

  ngOnInit(): void {
    console.log('AuthorizeUser!!!', this)

  }


}
