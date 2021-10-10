import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  userData: any = null; // Save logged in user data

  constructor(private afAuth: AngularFireAuth, private fireStore: AngularFirestore) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log("getting there")
        this.userData = user;
        console.log(user)
      } else {
        this.userData = null;
      }
    })
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;
        this.userData = user;
        const userRef = this.fireStore.doc(`users/${user.uid}`);
        userRef.set({
          uid: user.uid,
          name: 'Isabella Ketley',
          email: user.email,
        })
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  signIn(value) {
    return this.afAuth.signInWithEmailAndPassword(value.email, value.password)
      .then((result) => {
        console.log("update data");
        this.userData = result.user;
        console.log(result.user.uid)
        console.log("done");
      })
  }

  signoutUser() {
    return new Promise<void>((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            console.log("Sign out");
            this.userData = null;
            resolve();
          }).catch(() => {
            reject();
          });
      }
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    console.log(this.userData);
    return (this.userData !== null) ? true : false;
  }

}
