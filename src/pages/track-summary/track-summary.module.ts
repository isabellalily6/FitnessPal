import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackSummaryPageRoutingModule } from './track-summary-routing.module';

import { TrackSummaryPage } from './track-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackSummaryPageRoutingModule
  ],
  declarations: [TrackSummaryPage]
})
export class TrackSummaryPageModule { }
