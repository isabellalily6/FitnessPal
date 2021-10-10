import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  signupInfo: FormGroup;

  constructor(
    private authService: FirebaseAuthService, 
    private router: Router,
    private fb: FormBuilder,
    private loadingController: LoadingController
    ) {}

  ngOnInit() {
    this.signupInfo = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }


  get firstName(){
    return this.signupInfo.get('firstName');
  }

  get lastName(){
    return this.signupInfo.get('lastName');
  }
  get email(){
    return this.signupInfo.get('email');
  }

  get password(){
    return this.signupInfo.get('password');
  }

  async signup(){
    const loading = await this.loadingController.create();
    await loading.present();

    await this.authService.SignUp(this.signupInfo.value)
    .then(() => {
      loading.dismiss();
      this.router.navigate(['/tabs'])
    })
    .catch(() => {
      loading.dismiss();
      window.alert("Signup Failed")
    })
  }

}
