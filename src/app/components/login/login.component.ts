import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { LoginData } from '../../models/models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected backendError: string | undefined;
  loginForm = new FormGroup({
    username: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  constructor(private auth: AuthService) {}

  get passwordNotValid() {
    return (
      this.loginForm.controls.password.dirty &&
      this.loginForm.controls.password.touched &&
      !this.loginForm.controls.password.valid
    );
  }

  get usernameNotValid() {
    return (
      this.loginForm.controls.username.dirty &&
      this.loginForm.controls.username.touched &&
      !this.loginForm.controls.username.valid
    );
  }

  login() {
    if (!this.usernameNotValid && !this.passwordNotValid) {
      const data: LoginData = {
        username: this.loginForm.controls.username.value!,
        password: this.loginForm.controls.password.value!,
      };
      this.auth.login(data)?.subscribe({
        next(data) {},
        error: (err) => {
          this.backendError = err.error.error;
        },
      });
    }
  }
}
