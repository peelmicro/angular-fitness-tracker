import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UiService } from '../../shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate;
  signupForm: FormGroup;
  isLoading = false;
  private loadingSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      isLoading => this.isLoading = isLoading
    );
    this.signupForm = this.formBuilder.group({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'birthdate': new FormControl( moment(null), Validators.required),
      'agree': new FormControl('', Validators.required)
    });
    this.maxDate = moment().add(-18, 'years');
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.authService.registerUser({
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    });
  }
}
