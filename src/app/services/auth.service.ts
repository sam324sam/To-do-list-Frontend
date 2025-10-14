import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// para tokens npm install --save-dev @types/rxjs
import { Observable, BehaviorSubject, tap } from 'rxjs';

// Url de la api
import { environment } from '../../environments/environment';

// Para la respuesta del login
interface UserLoginResponse {
  username: string;
  password: string;
  id: string;
}

// Injectar el servicio en la raiz de la aplicacion (Importante dejar siempre antes del export class)
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/user';
  // Para guardar solo el estadso logico de la sesion (no el token) y variable reactiva que funciona como un remote event
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<UserLoginResponse> {
    return this.http
      .post<UserLoginResponse>(
        `${this.apiUrl}/login`,
        { username, password },
        { withCredentials: true } // importante para enviar cookies
      )
      .pipe(
        tap((response) => {
          // guardar datos de sesión
          localStorage.setItem('username', response.username);
          localStorage.setItem('id', response.id);
          localStorage.setItem('token', '1');
          this.isLoggedInSubject.next(true);
        })
      );
  }

  register(username: string, password: string, email: string): Observable<any> {
    return (
      this.http
        .post<any>(`${this.apiUrl}/register`, { username, password, email })
        // ejecutar la peticion
        .pipe(
          tap((response) => {
            console.log('Usuario registrado', response);
          })
        )
    );
  }

  // Desloguear en el frontend y en el backend
  logout(): void {
    // Borrar datos de sesión
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    // Cambiar estado reactivo
    this.isLoggedInSubject.next(false);

    // Opcional: llamar al backend si quieres destruir la sesion del server
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isLoginGuard(): boolean {
    return this.hasToken();
  }

  // Comprueba si existe el token en localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Observable para otros componentes
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
}
