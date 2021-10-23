import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapTrackingPage } from './map-tracking.page';

const routes: Routes = [
  {
    path: '',
    component: MapTrackingPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapTrackingPageRoutingModule { }
