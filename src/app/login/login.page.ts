import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from '../services/firebase-auth.service'

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

//code used from https://www.youtube.com/watch?v=RuuOdfz9Kxc&ab_channel=SimonGrimm

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private authService: FirebaseAuthService, 
    private router: Router,
    private fb: FormBuilder,
    private loadingController: LoadingController
    ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get email(){
    return this.credentials.get('email');
  }

  get password(){
    return this.credentials.get('password');
  }

  async login(){
    const loading = await this.loadingController.create();
    await loading.present();

    //console.log(this.authService.userData.uid)
    await this.authService.signIn(this.credentials.value)
    .then(() => {
      loading.dismiss();
      this.credentials.reset();
      this.router.navigate(['/tabs']);
    })
    .catch(() => {
      loading.dismiss();
      window.alert("Login Failed")
    })
  }

  async signOutUser(){
    //console.log(this.authService.userData.uid)
    await this.authService.signoutUser();
    this.router.navigate(['/tabs'])
  }

}
