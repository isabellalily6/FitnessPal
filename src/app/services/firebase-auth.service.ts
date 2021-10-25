import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})

export class FirebaseAuthService {
  userData: any = null; // Users login details

  constructor(
    private afAuth: AngularFireAuth,
    private fireStore: AngularFirestore) {
    // subscribe to authstate to notifiy of any changes
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
      } else {
        this.userData = null;
      }
    })
  }

  /*
  * Method to sign up a user, with their details
  */
  async SignUp(value: any) {
    // use firebase authentication to create a new user with their email and password
    return this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then((result) => {
        // retrieve the user data
        let user = result.user;
        this.userData = user;
        const userRef = this.fireStore.doc(`users/${user.uid}`);

        // set the users document with their relevant values
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

  /*
  * Method to sign in a user, with their details
  */
  async signIn(value: any) {
    // use firebase authentication to sign in a new user with their email and password
    return this.afAuth.signInWithEmailAndPassword(value.email, value.password)
      .then((result) => {
        // retrieve the user data
        this.userData = result.user;
      })
  }

  /*
  * Method to sign out a user
  */
  signoutUser() {
    return new Promise<void>((resolve, reject) => {
      // if a current user is logged in, sign them out
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            this.userData = null;
            resolve();
          }).catch(() => {
            reject();
          });
      }
    })
  }

  /*
  * Method to add a new track to a users database
  */
  async addNewTrack(path: Array<any>, distance: number, speed: number, times: any) {
    // get the date and use it to create a new document
    let date = new Date();
    const docRef = this.fireStore.doc(`users/${this.userData.uid}/tracks/${date.toJSON()}`);

    // set the relevant information in the document
    await docRef.set({
      path: path,
      distance: distance,
      speed: speed,
      times: times
    })

  }

  /*
  * Method to get all the users' tracks from the database
  */
  getAllTracks() {
    // collect the ordered collection and return it
    const collectionRef: AngularFirestoreCollection<any> =
      this.fireStore.collection(`users/${this.userData.uid}/tracks/`,
        ref => ref.orderBy("times.startTime", "desc"));

    return collectionRef.snapshotChanges();
  }

  /*
  * Method to get the users' tracks from the last week 
  */
  getweeklyTracks() {
    // get the current date and calculate the data a week ago
    let weekago = new Date();
    weekago.setDate(weekago.getDate() - 7)

    // collect the ordered and limited collection and return it
    const collectionRef: AngularFirestoreCollection<any> =
      this.fireStore.collection(`users/${this.userData.uid}/tracks/`, ref => ref
        .orderBy("times.startTime")
        .startAt(weekago)
        .endAt(new Date()))

    return collectionRef.snapshotChanges();
  }

  /*
  * Method to get the users details
  */
  getUserDetails() {
    // get the users information document and return it
    const userRef = this.fireStore.doc(`users/${this.userData.uid}`);
    return userRef.get();
  }

  /*
  * Method to update the users details
  */
  updateUserDetails(userDetails: any) {
    // get the users document 
    const userRef = this.fireStore.doc(`users/${this.userData.uid}`);

    // set the relevant information in the document
    return userRef.set({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      activitiesGoal: userDetails.activitiesGoal,
      distanceGoal: userDetails.distanceGoal
    })
  }

  /*
  * Returns whether a user is logged in or now
  * return true if the user is logged in, otherwise return false
  */
  get isLoggedIn(): boolean {
    return (this.userData !== null) ? true : false;
  }

}
