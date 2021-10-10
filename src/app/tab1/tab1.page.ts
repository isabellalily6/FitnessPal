import { Component } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userDetail: string;

  constructor(public authService: FirebaseAuthService) {}

  ngOnInit() {
    this.authService.userDetails().subscribe(response => {
      if (response !== null) {
        this.userDetail = response.email;
      } else {
        console.log("no user info")
      }
    }, error => {
      console.log(error);
    })
  }

}
