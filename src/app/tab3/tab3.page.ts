import { Component, ViewChild, ElementRef } from '@angular/core';

import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

declare var google;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    poly: any;
    markers = [];
   
    isTracking: boolean = false;
    watch: any;
    locations: any = [];

    startTime: Date;

  constructor(
    private router: Router 
  ) {}

  ionViewDidEnter(){
    this.showMap();
    console.log("testingggg");
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

  startTracking(){
    this.isTracking = true;
    this.startTime = new Date();

    this.watch = Geolocation.watchPosition({}, (position, error) => {
      if(position && this.isTracking){
        this.addNewPosition(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        )
      }
    })
  }

  stopTracking(){
    Geolocation.clearWatch(this.watch).then(() => {
      //console.log(path.pop().lat())
      this.isTracking = false;
      this.poly.setPath([]);

      let endTime = new Date();

      let navigationExtras: NavigationExtras = { state: { path: this.locations, startTime: this.startTime, endTime: endTime} };
      this.router.navigate(['/track-summary'], navigationExtras)

    })
  }

  addNewPosition(lat, lng, time){
    let tempLocation = {
      latitude: lat,
      longitude: lng,
      time: time
    }
    this.locations.push(tempLocation);

    let pos = new google.maps.LatLng(lat, lng);

    this.map.setCenter(pos);

    const path = this.poly.getPath();
    path.push(pos);
  }
}
