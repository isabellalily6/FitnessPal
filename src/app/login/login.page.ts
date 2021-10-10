import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public authService: FirebaseAuthService) {
   }

  ngOnInit() {
    
  }

  signInUser(){
    this.authService.signIn("isabellaketley@gmail.com", "password")
    .then((response) => {
      console.log(response)
      console.log(this.authService.userDetails())
    }, error => {
      console.log("error")
    })
  }

}
