import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Componentes de la vista global
import { Header } from "./header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('To-do-list-Frontend');
}
