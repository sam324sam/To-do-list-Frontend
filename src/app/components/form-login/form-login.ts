import { Component } from '@angular/core';
// Formularios reactivos
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// servicios
import { AuthService } from '../../services/auth.service';
import { MesageService } from '../../services/mesage.service';

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
  // Para la carga
  isLoadding: boolean = false;
  // Inyectar HttpClient para hacer solicitudes HTTP crea las peticiones http cuando se carga el componente readonly es solo de lectura
  constructor(private readonly authService: AuthService, private readonly router: Router, private readonly mesageService: MesageService) {}

  login() {
    interface LoginResponse {
      // Define el tipo de la respuesta segun lo que devuelva tu API (Luego ver si las cambiamos to-do a string)
      [key: string]: any;
    }
    this.isLoadding = true;
    // Llamar al servicio de auntetificacion
    this.authService.login(this.user.username, this.user.password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Usuario iniciado', response);
        this.mesageService.showMesage('Inicio de sesion exitoso', 'ok');
        this.router.navigate(['']);
        this.isLoadding = false;
      },
      error: (error: any) => {
        console.error('Error en el inicio de sesion', error);
        this.mesageService.showMesage('Error en el inicio de sesion', 'error');
        this.isLoadding = false;
      },
    });
  }
}
