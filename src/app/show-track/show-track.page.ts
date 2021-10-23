import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-track',
  templateUrl: './show-track.page.html',
  styleUrls: ['./show-track.page.scss'],
})
export class ShowTrackPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  path: any = null
  map: google.maps.Map;
  poly: google.maps.Polyline;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state;
    this.path = state.data.path;
  }

  ionViewDidEnter() {
    this.showMap();
  }

  async showMap() {
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
  }

}
