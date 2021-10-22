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
  }
  saveTrack() {
    console.log("saving track")

  }

}
