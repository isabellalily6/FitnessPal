import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'
import { Router } from '@angular/router';
import { google } from "google-maps";

import { getPathLength, getSpeed } from 'geolib';

declare var google: google;

@Component({
  selector: 'app-track-summary',
  templateUrl: './track-summary.page.html',
  styleUrls: ['./track-summary.page.scss'],
})
export class TrackSummaryPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  path: any = null
  totalDistance: any;
  averageSpeed: any;
  map: google.maps.Map;
  poly: google.maps.Polyline;
  times: any = {};

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state;
    this.path = state.path;
    this.totalDistance = getPathLength(this.path);
    this.averageSpeed = getSpeed(this.path[0], this.path[this.path.length - 1]);

    this.setTimes(state.startTime, state.endTime);
  ionViewDidEnter() {
    this.showMap();
  }

  async showMap() {
    console.log(this.path)
    let latLng = new google.maps.LatLng(this.path[0].latitude, this.path[0].longitude);

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

    let i = 0;
    while (i != this.path.length) {
      let currentLocation = this.path[i];
      let pos = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
      this.poly.getPath().push(pos);
      i++;
    }

    console.log(this.path);
  }

  saveTrack() {
    console.log("saving track")

  }

}

}
