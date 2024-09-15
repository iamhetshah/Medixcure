import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Use the inject function to get the UserService
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        sessionid: `${token}`,
      },
      withCredentials: true,
    });
    return next(cloned); // Pass the cloned request with the Authorization header
  }

  return next(req); // Pass the request as is if no token is available
};
