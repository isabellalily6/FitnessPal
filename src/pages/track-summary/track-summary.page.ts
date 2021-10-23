import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseAuthService } from '../../app/services/firebase-auth.service'
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

    console.log(getPathLength(this.path));
    console.log(getSpeed(this.path[0], this.path[this.path.length - 1]))
    console.log(getSpeed({ latitude: 51.567294, longitude: 7.38896, time: 1360231200880 },
      { latitude: 52.54944, longitude: 13.468509, time: 1360245600880 }))

    console.log(new Date(this.path[0].time));
  }

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
    this.authService.addNewTrack(this.path, this.totalDistance, this.averageSpeed, this.times);
    this.router.navigate(['/tabs/activities-list'])
  }

  // taken from https://newbedev.com/js-convert-milliseconds-to-hours-minutes-seconds-code-example
  setTimes(sTime, eTime) {
    let duration = eTime - sTime;

    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let shours = (hours < 10) ? "0" + hours : hours;
    let sminutes = (minutes < 10) ? "0" + minutes : minutes;
    let sseconds = (seconds < 10) ? "0" + seconds : seconds;

    let formattedDiff = shours + ":" + sminutes + ":" + sseconds;

    this.times = {
      startTime: sTime,
      finishTime: eTime,
      timeDiff: formattedDiff
    };


    console.log(formattedDiff);
    console.log(this.times);
  }

}
