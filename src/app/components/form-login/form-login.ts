import { Component } from '@angular/core';
// Formularios reactivos
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// servicio de autenticacion
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-form-login',
  imports: [FormsModule],
  templateUrl: './form-login.html',
  styleUrl: './form-login.css',
})
export class FormLogin {
  // Objeto para enlazar con el formulario
  user = {
    username: '',
    password: '',
  };
  // Inyectar HttpClient para hacer solicitudes HTTP crea las peticiones http cuando se carga el componente readonly es solo de lectura
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  login() {
    interface LoginResponse {
      // Define el tipo de la respuesta segun lo que devuelva tu API (Luego ver si las cambiamos to-do a string)
      [key: string]: any;
    }
    // Llamar al servicio de auntetificacion
    this.authService.login(this.user.username, this.user.password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Usuario iniciado', response);
        alert('Inicio de sesion exitoso');
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.error('Error en el inicio de sesion', error);
        alert('Error en el inicio de sesion');
      },
    });
  }
}
