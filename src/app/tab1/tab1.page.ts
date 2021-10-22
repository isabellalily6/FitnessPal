import { Component } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'
import { Motion } from '@capacitor/motion';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userDetail: string;

  constructor(public authService: FirebaseAuthService) {
  }

  async ngOnInit() {
  }

  onClick(){
      // Once the user approves, can start listening:
     Motion.addListener('accel', event => {
      console.log('Device motion event:', event);
      console.log(event.acceleration.x);
      console.log(event.acceleration.y);
      console.log(event.acceleration.z);
    });
    }
}