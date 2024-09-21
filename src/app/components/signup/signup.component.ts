import { AfterViewInit, Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Hospital, SignUpData } from '../../models/models';
import { first } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../../../constants';

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
    isDoctor: new FormControl(false, {
      validators: [Validators.required],
    }),
    specialities: new FormControl('', {
      validators: [Validators.required],
    }),
    yoe: new FormControl(0, {
      validators: [Validators.required],
    }),
    qualification: new FormControl('', {
      validators: [Validators.required],
    }),
    lno: new FormControl(0, {
      validators: [Validators.required],
    }),

    hospital: new FormControl(undefined, {
      validators: [Validators.required],
    }),
  });

  protected hospitals = signal<Hospital[]>([]);

  isDoctor: boolean = false;
  constructor(private auth: AuthService, private http: HttpClient) {
    this.http
      .get<{ hospitals: Hospital[] }>(constants.BASE_URL + 'get_hospital')
      .subscribe({
        next: (res) => {
          this.hospitals.update((old) => res.hospitals);
          console.log(this.hospitals());
        },
      });
  }
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
    console.log(this.signupForm.controls.gender.value);
    return (
      this.signupForm.controls.gender.dirty &&
      this.signupForm.controls.gender.touched &&
      !this.signupForm.controls.gender.valid
    );
  }

  updateDoctorFieldsValidators(isDoctor: boolean): void {
    const specialitiesControl = this.signupForm.get('specialities');
    const yoeControl = this.signupForm.get('yoe');
    const qualificationControl = this.signupForm.get('qualification');
    const lnoControl = this.signupForm.get('lno');
    const hospitalControl = this.signupForm.get('hospital');

    if (isDoctor) {
      // Add required validators if isDoctor is true
      specialitiesControl?.setValidators([Validators.required]);
      yoeControl?.setValidators([Validators.required, Validators.min(1)]);
      qualificationControl?.setValidators([Validators.required]);
      lnoControl?.setValidators([Validators.required]);
      hospitalControl?.setValidators([Validators.required]);
    } else {
      // Clear validators if isDoctor is false
      specialitiesControl?.clearValidators();
      yoeControl?.clearValidators();
      qualificationControl?.clearValidators();
      lnoControl?.clearValidators();
      hospitalControl?.clearValidators();
    }

    // Update the form controls to reflect the changes
    specialitiesControl?.updateValueAndValidity();
    yoeControl?.updateValueAndValidity();
    qualificationControl?.updateValueAndValidity();
    lnoControl?.updateValueAndValidity();
    hospitalControl?.updateValueAndValidity();
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

  protected formNotValid = signal(false);

  signIn() {
    if (
      this.emailNotValid ||
      this.genderNotValid ||
      this.lastNameNotValid ||
      this.passwordNotValid ||
      this.usernameNotValid ||
      this.firstNameNotValid ||
      this.dateOfBirthNotValid
    ) {
      this.formNotValid.set(true);
      return;
    }
    if (this.isDoctor) {
      this.signInDoctor();
    } else {
      this.signInPatient();
    }
  }

  signInDoctor() {
    const data: SignUpData = {
      password: this.signupForm.controls.password.value!,
      first_name: this.signupForm.controls.first_name.value!,
      last_name: this.signupForm.controls.last_name.value!,
      email: this.signupForm.controls.email.value!,
      date_of_birth: this.signupForm.controls.date_of_birth.value!,
      gender: this.signupForm.controls.gender.value!,
      role: this.signupForm.controls.isDoctor.value! ? 'D' : 'P',
      username: this.signupForm.controls.username.value!,
      specialities: this.signupForm.controls.specialities.value!.split(','),
      years_of_experience: this.signupForm.controls.yoe.value!,
      qualification: this.signupForm.controls.qualification.value!,
      hospital: this.signupForm.controls.hospital.value!,
      license_number: this.signupForm.controls.lno.value!,
    };

    console.log(data);

    this.auth.signup(data).subscribe({
      error: (err) => {
        this.backendError = err.error.error;
      },
    });
  }

  signInPatient() {
    const data: SignUpData = {
      password: this.signupForm.controls.password.value!,
      first_name: this.signupForm.controls.first_name.value!,
      last_name: this.signupForm.controls.last_name.value!,
      email: this.signupForm.controls.email.value!,
      date_of_birth: this.signupForm.controls.date_of_birth.value!,
      gender: this.signupForm.controls.gender.value!,
      role: this.signupForm.controls.isDoctor.value! ? 'D' : 'P',
      username: this.signupForm.controls.username.value!,
      specialities: this.signupForm.controls.specialities.value!.split(','),
      years_of_experience: this.signupForm.controls.yoe.value!,
      qualification: this.signupForm.controls.qualification.value!,
      hospital: this.signupForm.controls.hospital.value!,
      license_number: this.signupForm.controls.lno.value!,
    };

    console.log(data);

    this.auth.signup(data).subscribe({
      error: (err) => {
        this.backendError = err.error.error;
      },
    });
  }
}
