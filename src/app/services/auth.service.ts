import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// para tokens npm install --save-dev @types/rxjs
import { Observable, BehaviorSubject, tap } from 'rxjs';

// Url de la api
import { environment } from '../../environments/environment';
// Modelo de usuario
import { User } from '../models/User/user.model';

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

  checkSession(): void {
    this.http
      .get<UserLoginResponse>(`${this.apiUrl}/check-session`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          // Si el backend confirma la sesión, actualiza el localStorage
          localStorage.setItem('username', response.username);
          localStorage.setItem('id', response.id);
          localStorage.setItem('token', '1');
          this.isLoggedInSubject.next(true);
        },
        error: () => {
          // Si no hay sesión en el backend, borra el localStorage
          localStorage.removeItem('username');
          localStorage.removeItem('id');
          localStorage.removeItem('token');
          this.isLoggedInSubject.next(false);
        },
      });
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

  // Buscar he enlistar usuarios segun su nombre
  searchUserByName(username: string): Observable<User[]> {
    const params = new HttpParams().set('namePart', username);
    return this.http.get<User[]>(`${this.apiUrl}/searchUser`, { params, withCredentials: true });
  }

  // Comprueba si existe el token en localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Observable para otros componentes
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
}
