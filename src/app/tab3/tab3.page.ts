import { Component, ViewChild, ElementRef } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

declare var google: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;

    // Map related
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    markers = [];
   
    // Misc
    isTracking = false;
    watch: string;
    user = null;

  constructor() {}

  ionViewDidEnter(){
    this.showMap();
  }

  showMap() {
    let latLng = new google.maps.LatLng(51.9036442, 7.6673267);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

}
