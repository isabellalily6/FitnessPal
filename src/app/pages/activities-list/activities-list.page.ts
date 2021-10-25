import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service'
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
    // show the loading symbol
    const loading = await this.loadingController.create();
    await loading.present();

    // load all the tracks from firebase and process it and save it in a file
    this.authService.getAllTracks().subscribe(res => {
      this.activitiesData = res.map(e => {
        // format the data
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
      // dismiss the loading symbol once the data has been loaded
      loading.dismiss();
    });
  }

  /*
  * Method to show the users their track details
  */
  showTrack(itemId: string) {
    let itemData: any;

    // loop through each element to find the correct one
    this.activitiesData.forEach(element => {
      if (element.id == itemId) {
        itemData = element;
      }
    });

    // navigate to the show track screen with the item's data as a parameter 
    let navigationExtras: NavigationExtras = { state: { data: itemData } };
    this.router.navigate(['/show-track'], navigationExtras)
  }
}
