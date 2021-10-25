import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  // stores the users sign up information entered into the form
  signupInfo: FormGroup;

  constructor(
    private authService: FirebaseAuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    // set the sign up form items
    this.signupInfo = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  /*
  * Get the sign up forms first name
  */
  get firstName() {
    return this.signupInfo.get('firstName');
  }

  /*
  * Get the sign up forms last name
  */
  get lastName() {
    return this.signupInfo.get('lastName');
  }

  /*
  * Get the sign up forms email
  */
  get email() {
    return this.signupInfo.get('email');
  }

  /*
  * Get the sign up forms password
  */
  get password() {
    return this.signupInfo.get('password');
  }

  /*
  * Create a new account for the user
  */
  async signup() {
    // show the loading bar as the data is being processed
    const loading = await this.loadingController.create();
    await loading.present();

    // call the auth service to sign up the user
    await this.authService.SignUp(this.signupInfo.value)
      .then(() => {
        // if signup was successful, reset the form and navigate to a new page
        loading.dismiss();
        this.signupInfo.reset();
        this.router.navigate(['/tabs'])
      })
      .catch(() => {
        // if the login wasn't successful, notify the user
        loading.dismiss();
        window.alert("Signup Failed")
      })
  }

}
