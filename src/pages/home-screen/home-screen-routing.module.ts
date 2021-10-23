import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenPage } from './home-screen.page';

const routes: Routes = [
  {
    path: '',
    component: HomeScreenPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeScreenPageRoutingModule { }
