import { Component } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  activitiesData: any = [];

  constructor(
    private authService: FirebaseAuthService) {
    authService.getAllTracks().subscribe(res => {
      if(res){
        this.activitiesData = res.map(e=>{
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
        console.log(this.activitiesData);
      }  
    });
  }

}
