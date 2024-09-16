import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  Routes,
  UrlSegment,
} from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DoctorsComponent } from './components/doctors/doctors.component';

// Guard to prevent authenticated users from accessing certain routes
const onlyIfNotAuthenticated: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }
  return false;
};

// Guard to allow only authenticated users to access certain routes
const onlyIfAuthenticated: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['login']);
  return false;
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [onlyIfAuthenticated],
    component: HomeComponent,
  },
  {
    path: 'login',
    canActivate: [onlyIfNotAuthenticated],
    component: LoginComponent,
  },
  {
    path: 'signup',
    canActivate: [onlyIfNotAuthenticated],
    component: SignupComponent,
  },
  {
    path: 'doctors',
    canActivate: [onlyIfAuthenticated],
    component: DoctorsComponent,
  },
];
