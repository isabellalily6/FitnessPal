import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userDetails: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userDetails = this.fb.group({
      firstName: ['2   '],
      lastName: ['2   '],
      distanceGoal: ['2'],
      activtiesGoal: ['2']
    })
  }

  updateDetails(){

  }

}
