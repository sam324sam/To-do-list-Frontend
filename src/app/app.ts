import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Componentes de la vista global
import { Header } from './components/header/header';

// Autentificacion de sesions
import { AuthService } from './services/auth.service';
import { Mesage } from "./shared/mesage/mesage";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Mesage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('To-do-list-Frontend');
  constructor(private readonly authService: AuthService) {}

  // Verficare sesison con backen cada 5 minutos y al inicar el apps
  ngOnInit(): void {
    this.authService.checkSession();
    setInterval(() => this.authService.checkSession(), 5 * 60 * 1000); // cada 5 minutos
  }
}
