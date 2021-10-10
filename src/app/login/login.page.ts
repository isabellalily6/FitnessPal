import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public authService: FirebaseAuthService, private router: Router) {
   }

  ngOnInit() {
    
  }

  signInUser(){
    console.log(this.authService.userData.uid)
    this.authService.signIn("isabellaketley@gmail.com", "password");
    this.router.navigate(['/navigation'])
  }

}
