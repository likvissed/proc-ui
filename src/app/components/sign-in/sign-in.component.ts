import { Component, OnInit } from '@angular/core';
import { AuthCenter } from 'src/app/services/auth-center.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(
    private authCenter: AuthCenter
  ) { }

  ngOnInit(): void {
    console.log('this', this)
  }

  redirectAuthCenter() {
    window.location.href = this.authCenter.authorizeUrl()
  }

}
