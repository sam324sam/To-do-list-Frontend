import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// Servicios
import { AuthService } from '../../services/auth.service';
import { MesageService } from '../../services/mesage.service';

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
  // Para la carga
  isLoadding: boolean = false;
  
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly AuthService: AuthService,
    private readonly mesageService: MesageService
  ) {}

  register() {
    // Limpiar errores previos
    this.backendErrors = {
      succes: '',
      username: '',
      password: '',
      email: '',
    };
    this.isLoadding = true;
    this.mesageService.showMesage('Este proceso puede tardar un poco si el servidor se inicia por primera vez', 'info');
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
          this.mesageService.showMesage(this.backendErrors.succes, 'ok');
          //  redirigir al login
          this.router.navigate(['/login'])
        } else {
          // Si vienen errores por campo
          // Los ... son para insertar los campos de un objeto en otro
          this.backendErrors = { ...this.backendErrors, ...response };
        }
        this.isLoadding = false;
      },
      error: (error) => {
        // Si el backend devolvió 400 con errores por campo
        if (error.status === 400 && error.error) {
          this.backendErrors = { ...this.backendErrors, ...error.error };
        } else {
          // Por si se me escapa algo
          this.mesageService.showMesage('Error inesperado. Inténtalo de nuevo más tarde.', 'error');
        }
        this.isLoadding = false;
      },
    });
  }
  

}