import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackSummaryPage } from './track-summary.page';

const routes: Routes = [
  {
    path: '',
    component: TrackSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackSummaryPageRoutingModule { }
