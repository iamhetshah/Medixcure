import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUpData } from '../../models/models';
import { first } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements AfterViewInit {
  protected backendError: string | undefined;
  signupForm = new FormGroup({
    first_name: new FormControl('', {
      validators: [Validators.required],
    }),
    last_name: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.email],
    }),
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
    date_of_birth: new FormControl('', {
      validators: [Validators.required],
    }),
    gender: new FormControl('male', {
      validators: [Validators.pattern('^(male|female)$')],
    }),
  });
  constructor(private auth: AuthService) {}
  ngAfterViewInit(): void {}

  public get firstNameNotValid(): boolean {
    return (
      this.signupForm.controls.first_name.dirty &&
      this.signupForm.controls.first_name.touched &&
      !this.signupForm.controls.first_name.valid
    );
  }

  public get lastNameNotValid(): boolean {
    return (
      this.signupForm.controls.last_name.dirty &&
      this.signupForm.controls.last_name.touched &&
      !this.signupForm.controls.last_name.valid
    );
  }

  public get emailNotValid(): boolean {
    return (
      this.signupForm.controls.email.dirty &&
      this.signupForm.controls.email.touched &&
      !this.signupForm.controls.email.valid
    );
  }

  public get usernameNotValid(): boolean {
    return (
      this.signupForm.controls.username.dirty &&
      this.signupForm.controls.username.touched &&
      !this.signupForm.controls.username.valid
    );
  }

  public get passwordNotValid(): boolean {
    return (
      this.signupForm.controls.password.dirty &&
      this.signupForm.controls.password.touched &&
      !this.signupForm.controls.password.valid
    );
  }

  public get dateOfBirthNotValid(): boolean {
    return (
      this.signupForm.controls.date_of_birth.dirty &&
      this.signupForm.controls.date_of_birth.touched &&
      !this.signupForm.controls.date_of_birth.valid
    );
  }

  public get genderNotValid(): boolean {
    return (
      this.signupForm.controls.gender.dirty &&
      this.signupForm.controls.gender.touched &&
      !this.signupForm.controls.gender.valid
    );
  }

  disbaleButton() {
    return (
      this.passwordNotValid ||
      this.emailNotValid ||
      this.lastNameNotValid ||
      this.firstNameNotValid ||
      this.genderNotValid ||
      this.usernameNotValid ||
      this.dateOfBirthNotValid
    );
  }

  signIn() {
    const data: SignUpData = {
      password: this.signupForm.controls.password.value!,
      first_name: this.signupForm.controls.first_name.value!,
      last_name: this.signupForm.controls.last_name.value!,
      email: this.signupForm.controls.email.value!,
      date_of_birth: this.signupForm.controls.date_of_birth.value!,
      gender: this.signupForm.controls.gender.value!,
      role: 'P',
      username: this.signupForm.controls.username.value!,
    };

    this.auth.signup(data).subscribe({
      error: (err) => {
        this.backendError = err.error.error;
      },
    });
  }
}
