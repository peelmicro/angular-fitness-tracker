import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authChange = new Subject<boolean>();

  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService
  ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubscriptions();
          this.isAuthenticated = false;
          this.authChange.next(false);
          this.router.navigate(['/login']);
        }
      }
    );
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.uiService.loadingStateChanged.next(false);
        this.openSnackBar('Registration successful', 'green-snackbar');
      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.openSnackBar(error.message, 'red-snackbar');
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.uiService.loadingStateChanged.next(false);
        this.openSnackBar('Logged in successfully', 'green-snackbar');
      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        this.openSnackBar(error.message, 'red-snackbar');
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.openSnackBar('Logged out successfully', 'green-snackbar');
  }

  isAuth() {
    return this.isAuthenticated;
  }

  openSnackBar(message: string, className: string) {
    // this.uiService.showSnackBar(message, className, null, 2000, 'right');
    this.uiService.showSnackBar(message, className);
  }
}
