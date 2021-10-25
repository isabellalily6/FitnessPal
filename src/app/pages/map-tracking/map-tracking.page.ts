import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-map-tracking',
  templateUrl: 'map-tracking.page.html',
  styleUrls: ['map-tracking.page.scss']
})

export class MapTrackingPage {
  @ViewChild('map') mapElement: ElementRef;
  // store the map and the maps polyline information
  map: any;
  poly: any;

  // create the variables to be used on the screen
  isTracking: boolean = false;
  watch: any;
  locations: any = [];
  startTime: Date;

  constructor(
    private router: Router
  ) { }

  ionViewDidEnter() {
    this.showMap();
  }

  /*
  * Set up and show the map to the user
  */
  async showMap() {
    // get the devices co-ordinates
    const coordinates = await Geolocation.getCurrentPosition();
    let latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    // set the map options, and center it on the devices location
    let mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    // set the options for the poly line
    this.poly = new google.maps.Polyline({
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    this.poly.setMap(this.map);
  }

  /*
  * Start tracking the users path
  */
  async startTracking() {
    this.isTracking = true;
    this.startTime = new Date();

    // set a watch on the users position
    this.watch = await Geolocation.watchPosition({}, (position, error) => {
      // if theres a new position and the programs tracking, add the new position
      if (position && this.isTracking) {
        this.addNewPosition(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        );
      } else if (error) {
        console.log(error);
      };
    });
  }

  /*
  * Stop tracking the users path
  */
  stopTracking() {
    // clear the watch
    Geolocation.clearWatch({ id: this.watch }).then(() => {
      // reset all the variables
      this.isTracking = false;
      this.poly.setPath([]);

      let endTime = new Date();

      // navigate to the track summary screen with the appropriate information
      let navigationExtras: NavigationExtras = { state: { path: this.locations, startTime: this.startTime, endTime: endTime } };
      this.locations = [];
      this.router.navigate(['/track-summary'], navigationExtras)

    })
  }

  /*
  * Add a new position 
  */
  addNewPosition(lat: number, lng: number, time: number) {
    // create an object for the locations to add to the path and locations 
    let tempLocation = {
      latitude: lat,
      longitude: lng,
      time: time
    }

    // add the information to the arrays and map
    this.locations.push(tempLocation);
    let pos = new google.maps.LatLng(lat, lng);
    const path = this.poly.getPath();
    path.push(pos);

    // recenter the map
    this.map.setCenter(pos);
  }
}
