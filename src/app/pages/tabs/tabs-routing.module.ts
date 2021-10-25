import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home-screen',
        loadChildren: () => import('../home-screen/home-screen.module').then(m => m.HomeScreenPageModule)
      },
      {
        path: 'map-tracking',
        loadChildren: () => import('../map-tracking/map-tracking.module').then(m => m.MapTrackingPageModule)
      },
      {
        path: 'activities-list',
        loadChildren: () => import('../activities-list/activities-list.module').then(m => m.Tab2PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home-screen',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home-screen',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
