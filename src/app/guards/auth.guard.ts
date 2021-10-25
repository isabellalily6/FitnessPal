import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  
  constructor(private authService: FirebaseAuthService, private router: Router) { }
  
  /*
  * Determines whether the page is allowed to be loaded
  */
  canLoad() {
    const isAuthenticated = this.authService.isLoggedIn;
    
    // if the user is authenticated, then they can view the page
    if (isAuthenticated) {
      return true;
    } else {
      // if the user isn't authenticated, redirect them to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
