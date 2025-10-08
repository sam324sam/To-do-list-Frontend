import { Component } from '@angular/core';
// Peticiones HTTP
import { HttpClient } from '@angular/common/http';
// Formularios reactivos
import { FormsModule } from '@angular/forms';
// Router para redigir
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-register',
  imports: [FormsModule], // Importar FormsModule para usar formularios reactivos
  templateUrl: './form-register.html',
  styleUrl: './form-register.css',
})
export class FormRegister {
  // Objeto para enlazar con el formulario
  user = {
    username: '',
    password: '',
    email: '',
  };
  // Inyectar HttpClient para hacer solicitudes HTTP crea las peticiones http cuando se carga el componente readonly es solo de lectura
  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  register() {
    interface User {
      username: string;
      password: string;
      email: string;
    }

    interface RegisterResponse {
      // Define el tipo de la respuesta segun lo que devuelva tu API (Luego ver si las cambiamos to-do a string)
      [key: string]: any;
    }

    this.http
      .post<RegisterResponse>('http://localhost:8080/api/user/register', this.user as User)
      .subscribe({
        next: (response: RegisterResponse) => {
          console.log('Usuario registrado', response);
          alert('Registro exitoso');
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          console.error('Error en el registro', error);
          alert('Error en el registro');
        },
      });
  }
}
