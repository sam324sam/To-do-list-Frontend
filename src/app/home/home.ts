import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
// EL On pipipi es una interfaz
export class Home implements OnInit, OnDestroy {
  isLoggedIn = false;
  user = {
    username: '',
    id: '',
  };

  constructor(private readonly authService: AuthService) {}
  // Para ver los cambios de is loged
  private subscription!: Subscription;

  ngOnInit(): void {
    // marcar a que observable va a vigilar el is logged de aut service
    this.subscription = this.authService.isLoggedIn$.subscribe((logged) => {
      this.isLoggedIn = logged;
      if (logged) {
        this.user.username = localStorage.getItem('username') ?? '';
        this.user.id = localStorage.getItem('id') ?? '';
      } else {
        this.user = { username: '', id: '' };
      }
    });
  }

  ngOnDestroy() {
    // Limpiar la suscripción al destruir el componente
    this.subscription?.unsubscribe();
  }
}
