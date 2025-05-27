import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.getToken() !== null;
  const isAdmin = authService.getUserType() == '0';

  if (isLoggedIn && isAdmin) return true;

  return router.createUrlTree(['/']);
};
