import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivitiesListPage } from './activities-list.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ActivitiesListPageRoutingModule } from './activities-list-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ActivitiesListPageRoutingModule
  ],
  declarations: [ActivitiesListPage]
})
export class Tab2PageModule { }
