import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-track',
  templateUrl: './show-track.page.html',
  styleUrls: ['./show-track.page.scss'],
})

export class ShowTrackPage implements OnInit {
  // create the variables to store the map, path and polyline
  @ViewChild('map') mapElement: ElementRef;
  path: any = null
  map: google.maps.Map;
  poly: google.maps.Polyline;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    // get the track path from the router navigation
    const state = this.router.getCurrentNavigation().extras.state;
    this.path = state.data.path;
  }

  ionViewDidEnter() {
    this.showMap();
  }

  /*
  * Set up and show the map to the user
  */
  async showMap() {
    let latLng = new google.maps.LatLng(this.path[0].latitude, this.path[0].longitude);

    // set the map options, and center it on the tracks first location
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

    // loop through all the points on the path and draw it on the map
    let i = 0;
    while (i != this.path.length) {
      let currentLocation = this.path[i];
      let pos = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
      this.poly.getPath().push(pos);
      i++;
    }
  }
}
