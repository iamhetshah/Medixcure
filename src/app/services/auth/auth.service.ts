import { Injectable, signal } from '@angular/core';
import {
  LoginData,
  LoginResponse,
  LogoutResponse,
  SignUpData,
  SignUpResponse,
  User,
} from '../../models/models';
import { HttpClient } from '@angular/common/http';

import { constants } from '../../../../constants';
import { Router } from '@angular/router';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = signal(false);
  private user: User | undefined = undefined;
  constructor(private http: HttpClient, private router: Router) {
    const sessionId = localStorage.getItem(constants.TOKEN);
    if (sessionId) {
      const u = localStorage.getItem('user');
      if (u) {
        this.user = JSON.parse(u);
        this.authenticated.update((last) => true);
      }
    }
  }
  logout() {
    this.http.get<LogoutResponse>(constants.BASE_URL + 'logout').subscribe({
      next: (response) => {
        if (!response.error) {
          this.removeAuthData();
          this.router.navigate(['/login']);
        } else {
          console.log(response);
        }
      },
      error: (err) => {
        return err.error;
      },
    });
  }

  removeAuthData() {
    localStorage.removeItem(constants.TOKEN);
    localStorage.removeItem('user');
    this.user = undefined;
    this.authenticated.update((last) => false);
  }

  signup(data: SignUpData) {
    return this.http
      .post<SignUpResponse>(`${constants.BASE_URL}signup/`, data)
      .pipe(
        map((response: SignUpResponse) => {
          this.handleLogin(response.user);
          return response;
        }),
        catchError((error) => {
          return throwError(() => error); // Propagate the error back to the subscriber
        })
      );
  }

  login(data: LoginData) {
    if (!this.authenticated()) {
      return this.http
        .post<LoginResponse>(`${constants.BASE_URL}login/`, data)
        .pipe(
          map((loginRes: LoginResponse, idx: number) => {
            if (!loginRes.error) {
              this.handleLogin(loginRes);
            }
            return loginRes;
          }),
          catchError((error) => {
            return throwError(() => error);
          })
        );
    }
    return undefined;
  }

  private handleLogin(user: LoginResponse) {
    localStorage.setItem(constants.TOKEN, user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.authenticated.update((last) => true);
    this.router.navigate(['']);
  }

  getUser(): User | undefined {
    if (this.user) {
      return { ...this.user };
    }
    return undefined;
  }

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  getToken(): string | null {
    return localStorage.getItem(constants.TOKEN);
  }
}
