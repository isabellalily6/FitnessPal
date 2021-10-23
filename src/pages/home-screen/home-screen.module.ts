import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeScreenPage } from './home-screen.page';
import { ExploreContainerComponentModule } from '../../app/explore-container/explore-container.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { HomeScreenPageRoutingModule } from './home-screen-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomeScreenPageRoutingModule,
    NgCircleProgressModule.forRoot()],
  declarations: [HomeScreenPage]
})
export class HomeScreenPageModule { }
