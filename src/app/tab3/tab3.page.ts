import { Component, ViewChild, ElementRef } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

declare var google;

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
    poly: any;
    markers = [];
   
    isTracking: boolean = false;
    watch: any;

  constructor() {}

  ionViewDidEnter(){
    this.showMap();
  }

  async showMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    let latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.poly = new google.maps.Polyline({
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    this.poly.setMap(this.map);
  }

  updateMap(locations){
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];

    for (let loc of locations){
      let pos = new google.maps.LatLng(loc.lat, loc.lng);

      let marker = new google.maps.Marker({
        position: pos,
        animation: google.maps.Animation.DROP,
        map: this.map
      });
      this.markers.push(marker);
    }
  }

  startTracking(){
    this.isTracking = true;

    this.watch = Geolocation.watchPosition({}, (position, error) => {
      if(position && this.isTracking){
        console.log("test")
        this.addNewPosition(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        )
      }
    })
    console.log(this.watch)
  }

  stopTracking(){
    console.log(this.watch)
    Geolocation.clearWatch(this.watch).then(() => {
      console.log(this.watch)
      console.log("hello");
      this.isTracking = false;
    })
  }

  addNewPosition(lat, lng, time){
    let pos = new google.maps.LatLng(lat, lng);
    console.log("test1")
    const path = this.poly.getPath();

    path.push(pos);

    new google.maps.Marker({
      position: pos,
      title: "#" + path.getLength(),
      map: this.map,
    });

  }

}
