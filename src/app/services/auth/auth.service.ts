import { Injectable } from '@angular/core';
import {
  ErrorAuth,
  LoginData,
  LoginResponse,
  LogoutResponse,
  SignUpData,
  User,
} from '../../models/models';
import { HttpClient } from '@angular/common/http';

import { constants } from '../../../../constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated: boolean = false;
  private user: User | undefined = undefined;
  constructor(private http: HttpClient, private router: Router) {
    const sessionId = localStorage.getItem(constants.TOKEN);
    console.log(sessionId);
    if (sessionId) {
      const u = localStorage.getItem('user');
      if (u) {
        this.user = JSON.parse(u);
        this.authenticated = true;
      }
    }
  }
  logout() {
    this.http.get<LogoutResponse>(constants.BASE_URL + 'logout').subscribe({
      next: (response) => {
        if (!response.error) {
          localStorage.removeItem(constants.TOKEN);
          localStorage.removeItem('user');
          this.user = undefined;
          this.authenticated = false;
        } else {
          console.log(response);
        }
      },
      error: (err) => {},
    });
  }

  signup(data: SignUpData) {
    const error: ErrorAuth = {
      message: null,
    };
    this.http
      .post<{ user: LoginResponse }>(
        constants.BASE_URL + 'signup/',
        JSON.stringify(data)
      )
      .subscribe({
        next: (response) => {
          this.handleLogin(response.user);
        },
        error: (e) => {
          error.message = e.error;
        },
      });
    return error;
  }

  login(data: LoginData) {
    const error: ErrorAuth = {
      message: null,
    };
    if (!this.authenticated) {
      this.http
        .post<{ user: LoginResponse }>(`${constants.BASE_URL}login/`, data)
        .subscribe({
          next: (response) => {
            this.handleLogin(response.user);
          },
          error: (e) => {
            error.message = e.error;
          },
        });
    }
  }

  private handleLogin(user: LoginResponse) {
    localStorage.setItem(constants.TOKEN, user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.authenticated = true;
    this.router.navigate(['']);
  }

  getUser(): User | undefined {
    if (this.user) {
      return { ...this.user };
    }
    return undefined;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getToken(): string | null {
    return localStorage.getItem('session_id');
  }
}
