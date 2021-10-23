import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FirebaseAuthService} from '../services/firebase-auth.service'

import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userDetails: FormGroup;
  userData: any = {};

  constructor(
    private authService: FirebaseAuthService, 
    private router: Router,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) { 
    authService.getUserDetails().subscribe(res => {
        this.userData = res.data();
        console.log(this.userData);
        this.userDetails = this.fb.group({
          firstName: [this.userData.firstName],
          lastName: [this.userData.lastName],
          distanceGoal: [this.userData.distanceGoal],
          activitiesGoal: [this.userData.activitiesGoal]
        })
      });
  }

  ngOnInit() {
    this.userDetails = this.fb.group({
      firstName: [''],
      lastName: [''],
      distanceGoal: [''],
      activitiesGoal: ['']
    })
  }

  async updateDetails(){
    const loading = await this.loadingController.create();
    await loading.present();

    await this.authService.updateUserDetails(this.userDetails.value)
    .then(() => {
      loading.dismiss();
      this.router.navigate(['/tabs']);
    })
    .catch(() => {
      loading.dismiss();
      window.alert("Updating Details Failed")
    })

    console.log("update");
  }

}
