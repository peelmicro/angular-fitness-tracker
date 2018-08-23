import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxDate;
  signupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'birthdate': new FormControl( moment(null), Validators.required),
      'agree': new FormControl('', Validators.required)
    });
    this.maxDate = moment().add(-18, 'years');
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  onSubmit() {
    console.log(this.signupForm);
  }
}
