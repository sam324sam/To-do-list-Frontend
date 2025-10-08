import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(): boolean {
    // comprobamos si hay sesion
    const loggedIn = this.authService.isLoginGuard();

    if (!loggedIn) {
      // si no esta logueado, lo mandamos al login
      this.router.navigate(['/login']);
      return false;
    }

    // si esta logueado, permitimos el acceso
    return true;
  }
}
/* Se usa con esta linea
export const routes: Routes = [
  { path: '', component: Home, canActivate: [AuthGuard] }
}*/
