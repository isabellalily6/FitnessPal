import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FirebaseAuthService} from '../services/firebase-auth.service'

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
    private fb: FormBuilder
  ) { 
    authService.getUserDetails().subscribe(res => {
        this.userData = res.data();
        console.log(this.userData);
        this.userDetails = this.fb.group({
          firstName: [this.userData.firstName + '   '],
          lastName: [this.userData.lastName + '   '],
          distanceGoal: [this.userData.distanceGoal],
          activtiesGoal: [this.userData.activitiesGoal]
        })
      });
  }

  ngOnInit() {
    this.userDetails = this.fb.group({
      firstName: [''],
      lastName: [''],
      distanceGoal: [''],
      activtiesGoal: ['']
    })
  }


  updateDetails(){

  }

}
