import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseAuthService } from '../../app/services/firebase-auth.service'
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {
  // store the users details
  userDetails: FormGroup;

  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) {
    // get the users details from the database
    authService.getUserDetails().subscribe(res => {
      let userData: any = res.data();
      // set the form details to the users details
      this.userDetails = this.fb.group({
        firstName: [userData.firstName],
        lastName: [userData.lastName],
        distanceGoal: [userData.distanceGoal],
        activitiesGoal: [userData.activitiesGoal]
      })
    });
  }

  ngOnInit() {
    // set the user details form items
    this.userDetails = this.fb.group({
      firstName: [''],
      lastName: [''],
      distanceGoal: [''],
      activitiesGoal: ['']
    })
  }

  /*
  * Update the users details
  */
  async updateDetails() {
    // show the loading bar as the data is being processed
    const loading = await this.loadingController.create();
    await loading.present();

    // call the auth service to update the users details to the new details
    await this.authService.updateUserDetails(this.userDetails.value)
      .then(() => {
        // if the update was successful, navigate to a new page
        loading.dismiss();
        this.router.navigate(['/tabs']);
      })
      .catch(() => {
        // if the update wasn't successful, notify the user
        loading.dismiss();
        window.alert("Updating Details Failed")
      })
  }

  /*
  * Logout the user
  */
  logout() {
    // call the methods to logout the user and navigate to the login page
    this.authService.signoutUser();
    this.router.navigate(['/login']);
  }
}
