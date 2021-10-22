import { Component } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'
import { Motion } from '@capacitor/motion';
;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userDetail: string;
  weeklyData;

  constructor(public authService: FirebaseAuthService) {
    authService.getweeklyTracks().subscribe(res => {
      if(res){
        this.weeklyData = res
        .map(e=>{
          return {
            id: e.payload.doc.id,
            distance: e.payload.doc.data()['distance'],
            path: e.payload.doc.data()['path'],
            speed: e.payload.doc.data()['speed'],
            times: {
              startTime: e.payload.doc.data()['times'].startTime.toDate().toString().split(' ').slice(0, 5).join(' '),
              finishTime: e.payload.doc.data()['times'].finishTime.toDate().toString().split(' ').slice(0, 5).join(' '),
              timeDiff: e.payload.doc.data()['times'].timeDiff
          }
        }
        })   
        console.log(this.weeklyData);
      }  
    });
  }

  async ngOnInit() {
  }
}