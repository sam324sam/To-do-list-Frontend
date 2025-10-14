import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './form-register.html',
  styleUrl: './form-register.css',
})
export class FormRegister {
  user = {
    username: '',
    password: '',
    email: '',
  };

  // Objeto para almacenar errores del backend por campo
  backendErrors = {
    succes: '',
    username: '',
    password: '',
    email: '',
  }

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly AuthService: AuthService
  ) {}

  register() {
    // Limpiar errores previos
    this.backendErrors = {
      succes: '',
      username: '',
      password: '',
      email: '',
    };

    this.AuthService.register(
      this.user.username,
      this.user.password,
      this.user.email
    ).subscribe({
      next: (response) => {
        // Si viene un mensaje de exito lo mostramos con el alert
        if (response.succes) {
          this.backendErrors.succes = response.succes;
          console.log(this.backendErrors.succes);
          alert(this.backendErrors.succes)
          //  redirigir al login
          this.router.navigate(['/login'])
        } else {
          // Si vienen errores por campo
          // Los ... son para insertar los campos de un objeto en otro
          this.backendErrors = { ...this.backendErrors, ...response };
        }
      },
      error: (error) => {
        // Si el backend devolvió 400 con errores por campo
        if (error.status === 400 && error.error) {
          this.backendErrors = { ...this.backendErrors, ...error.error };
        } else {
          // Por si se me escapa algo
          console.error('Error inesperado:', error);
        }
      },
    });
  }
  

}