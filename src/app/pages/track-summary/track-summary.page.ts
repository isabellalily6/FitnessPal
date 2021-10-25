import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service'
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
  // store the map and the maps polyline information
  @ViewChild('map') mapElement: ElementRef;
  map: google.maps.Map;
  poly: google.maps.Polyline;

  // create the variables to store the activities information
  path: any = null
  totalDistance: any;
  averageSpeed: any;
  times: any = {};

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // get the track path from the router navigation
    const state = this.router.getCurrentNavigation().extras.state;
    this.path = state.path;

    // calculate the tracks total distance and average speed
    this.totalDistance = getPathLength(this.path);
    this.averageSpeed = getSpeed(this.path[0], this.path[this.path.length - 1]);

    this.setTimes(state.startTime, state.endTime);
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

  /*
  * Save the users track
  */
  saveTrack() {
    this.authService.addNewTrack(this.path, this.totalDistance, this.averageSpeed, this.times);
    this.router.navigate(['/tabs/activities-list'])
  }

  /*
  * Set the start time, end time, and duration time of the track
  * code taken from https://newbedev.com/js-convert-milliseconds-to-hours-minutes-seconds-code-example
  */
  setTimes(sTime: number, eTime: number) {
    let duration = eTime - sTime;

    // convert the duration into hours, minutes and seconds
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // format hours, minutes and seconds
    let shours = (hours < 10) ? "0" + hours : hours;
    let sminutes = (minutes < 10) ? "0" + minutes : minutes;
    let sseconds = (seconds < 10) ? "0" + seconds : seconds;

    let formattedDiff = shours + ":" + sminutes + ":" + sseconds;

    // set the times
    this.times = {
      startTime: sTime,
      finishTime: eTime,
      timeDiff: formattedDiff
    };
  }
}
