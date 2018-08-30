import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as Ui from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(
      user => {
        if (user) {
          this.store.dispatch(new Auth.SetAuthenticated());
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubscriptions();
          this.store.dispatch(new Auth.SetUnauthenticated());
          this.router.navigate(['/login']);
        }
      }
    );
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new Ui.StartLoading());
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.store.dispatch(new Ui.StopLoading());
        this.openSnackBar('Registration successful', 'green-snackbar');
      })
      .catch(error => {
        this.store.dispatch(new Ui.StopLoading());
        this.openSnackBar(error.message, 'red-snackbar');
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new Ui.StartLoading());
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.store.dispatch(new Ui.StopLoading());
        this.openSnackBar('Logged in successfully', 'green-snackbar');
      })
      .catch(error => {
        this.store.dispatch(new Ui.StopLoading());
        this.openSnackBar(error.message, 'red-snackbar');
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.openSnackBar('Logged out successfully', 'green-snackbar');
  }

  openSnackBar(message: string, className: string) {
    this.uiService.showSnackBar(message, className);
  }
}
