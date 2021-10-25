import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service'
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
  // stores the users credentials entered into the form
  credentials: FormGroup;

  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    // set the credentials items
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  /*
  * Get the credentials email
  */
  get email() {
    return this.credentials.get('email');
  }

  /*
  * Get the credentials password
  */
  get password() {
    return this.credentials.get('password');
  }

  /*
  * Login the user
  */
  async login() {
    // show the loading bar as the data is being processed
    const loading = await this.loadingController.create();
    await loading.present();

    // call the auth service to sign in the user and validate the credentials
    await this.authService.signIn(this.credentials.value)
      .then(() => {
        // if login was successful, reset the credentials and navigate to a new page
        loading.dismiss();
        this.credentials.reset();
        this.router.navigate(['/tabs']);
      })
      .catch(() => {
        // if the login wasnt successful, notify the user
        loading.dismiss();
        window.alert("Login Failed")
      })
  }
}
