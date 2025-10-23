import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  isLoggedIn = false;
  menuOpen = false;
  user = {
    username: '',
    id: '',
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  private subscription!: Subscription;

  ngOnInit(): void {
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
    this.subscription?.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['']);
  }
}