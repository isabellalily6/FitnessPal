import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapTrackingPage } from './map-tracking.page';
import { ExploreContainerComponentModule } from '../../app/explore-container/explore-container.module';

import { MapTrackingPageRoutingModule } from './map-tracking-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: MapTrackingPage }]),
    MapTrackingPageRoutingModule,
  ],
  declarations: [MapTrackingPage]
})
export class MapTrackingPageModule { }
