import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
// Servicios
import { AuthService } from '../../../../services/auth.service';
import { MesageService } from '../../../../services/mesage.service';
import { ListService } from '../../../../services/list.service';
/// modelos
import { User } from '../../../../models/User/user.model';
@Component({
  selector: 'app-shared-list',
  imports: [FormsModule],
  templateUrl: './shared-list.html',
  styleUrl: './shared-list.css',
})
export class SharedList implements OnInit {
  @Input() listId: number = 0;
  @Input() adminUserName: string = '';
  @Input() sharedList: boolean = false;
  @Input() username: string = '';
  @Output() togledSharedList = new EventEmitter();

  usersShared: User[] = [];
  loadingUserShare: boolean = false;

  // Cargar busqueda de usuario
  loadingUser: boolean = false;
  users: User[] = [];
  searchTerm: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly mesageService: MesageService,
    private readonly listService: ListService
  ) {}

  // Para los usuarios que tiene la lista
  ngOnInit(): void {
    this.getUserShared();
  }

  async getUserShared() {
    if (this.username !== this.adminUserName) {
      return;
    }
    this.loadingUserShare = true;
    try {
      this.usersShared = await firstValueFrom(this.listService.getUserSharedList(this.listId));
    } catch (error) {
      this.mesageService.showMesage('Error al encontrar los usuarios comportidos', 'error');
      console.error('Error al buscar usuario:', error);
      this.usersShared = [];
    } finally {
      this.loadingUserShare = false;
    }
  }

  cancelShared() {
    this.togledSharedList.emit();
  }

  // Buscar a los usuarios para compartir
  async searchUser(term: string): Promise<void> {
    // Por si esta vacio no mandar nada
    if (!term.trim()) {
      this.users = [];
      return;
    }
    this.loadingUser = true;
    try {
      this.users = await firstValueFrom(this.authService.searchUserByName(term));
    } catch (error) {
      this.mesageService.showMesage('No se pudo encontrar al usuario', 'error');
      console.error('Error al buscar usuario:', error);
      this.users = [];
    } finally {
      this.loadingUser = false;
    }
  }

  // Crear la lista compartida
  async createShared(userName: string, userId: number): Promise<void> {
    // Si no eres ya propietario luego cambiar el backend para que por peticion no explote
    if (userName === this.adminUserName) {
      this.mesageService.showMesage('Este usuario es el propietario', 'error');
      return;
    }
    // Ver si ya esta el usuario compartido
    const usersShared = this.usersShared.find((u) => u.id === userId);
    if (usersShared) {
      this.mesageService.showMesage('Este usuario ya tiene la tarea compartida', 'error');
      return;
    }
    this.loadingUser = true;
    this.loadingUserShare = true;
    try {
      await firstValueFrom(this.listService.createShared(this.listId, userId));
    } catch (error) {
      this.mesageService.showMesage('No se pudo encontrar al usuario', 'error');
      console.error('Error al buscar usuario:', error);
    } finally {
      this.loadingUser = false;
      this.getUserShared();
    }
  }

  async deleteShared(userName: string, userId: number): Promise<void> {
    if (userName === this.adminUserName) {
      this.mesageService.showMesage('Este usuario es el propietario no puede borrar', 'error');
      return;
    }
    // Ver si ya esta el usuario compartido
    const usersShared = this.usersShared.find((u) => u.id === userId);
    if (!usersShared) {
      this.mesageService.showMesage('Este usuario no tiene la tarea compartida', 'error');
      return;
    }
    this.loadingUser = true;
    this.loadingUserShare = true;
    try {
      await firstValueFrom(this.listService.deleteShared(this.listId, userId));
    } catch (error) {
      this.mesageService.showMesage('No se pudo encontrar al usuario', 'error');
      console.error('Error al buscar usuario:', error);
    } finally {
      this.loadingUser = false;
      this.getUserShared();
    }
  }
}
