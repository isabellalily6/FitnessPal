import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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
  SignUp(value) {
    return this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then((result) => {
        const user = result.user;
        this.userData = user;
        const userRef = this.fireStore.doc(`users/${user.uid}`);
        userRef.set({
          uid: user.uid,
          firstName: value.firstName,
          lastName: value.lastName,
          email: user.email,
          activitiesGoal: 0,
          distanceGoal: 0
        })
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

  async addNewTrack(path, distance, speed, times){
      let date = new Date();
      const userRef = this.fireStore.doc(`users/${this.userData.uid}/tracks/${date.toJSON()}`);

      await userRef.set({
        path: path,
        distance: distance, 
        speed: speed,
        times: times
      })

  }

  getAllTracks(){
    const collectionRef: AngularFirestoreCollection<any> = this.fireStore.collection(`users/${this.userData.uid}/tracks/`);

    return collectionRef.snapshotChanges();
  }

  getweeklyTracks(){
    let weekago = new Date();
    weekago.setDate(weekago.getDate()-7)
    console.log(weekago)
    const collectionRef: AngularFirestoreCollection<any> = this.fireStore.collection(`users/${this.userData.uid}/tracks/`, ref => ref
    .orderBy("times.startTime")
    .startAt(weekago)
    .endAt(new Date()))

    return collectionRef.snapshotChanges();
  }

  getUserDetails(){
    const userRef = this.fireStore.doc(`users/${this.userData.uid}`);
    return userRef.get();
  }

  updateUserDetails(userDetails){
    const userRef = this.fireStore.doc(`users/${this.userData.uid}`);
    userRef.set({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      activitiesGoal: userDetails.activitiesGoal,
      distanceGoal: userDetails.distanceGoal
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    console.log(this.userData);
    return (this.userData !== null) ? true : false;
  }

}
