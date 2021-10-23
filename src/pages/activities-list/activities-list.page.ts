import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../app/services/firebase-auth.service'
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-activities-list',
  templateUrl: 'activities-list.page.html',
  styleUrls: ['activities-list.page.scss']
})
export class ActivitiesListPage {
  activitiesData: any = [];

  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private loadingController: LoadingController) {
  }

  async ionViewWillEnter() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.getAllTracks().subscribe(res => {
      this.activitiesData = res.map(e => {
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
      loading.dismiss();
    });
  }

  showTrack(itemId) {
    console.log(itemId);
    let itemData: any;

    this.activitiesData.forEach(element => {
      if (element.id == itemId) {
        itemData = element;
      }
    });
    console.log(itemData);
    let navigationExtras: NavigationExtras = { state: { data: itemData } };
    this.router.navigate(['/show-track'], navigationExtras)
  }
}
