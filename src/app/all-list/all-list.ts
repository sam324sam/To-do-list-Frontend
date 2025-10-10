import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Servicio
import { ListService } from '../services/list.service';
// formularios
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-list.html',
  styleUrl: './all-list.css',
})
export class AllList implements OnInit {
  // Para guardar las listas
  lists: any[] = [];
  // Para mostrar un login despues
  loading: boolean = true;
  // para en caso de error
  error: string = '';
  // Para el formulario del add
  showAddForm: boolean = false;
  newListName: string = '';
  // Usuario de sesion
  user = {
    userName: '',
    id: '',
  };

  constructor(private readonly listService: ListService) {}

  // Llamar al service para la data luego sera con local storage en conjunto
  ngOnInit(): void {
    this.getListData();
    // obtener un nombre de sesion
    this.user.userName = localStorage.getItem('username') ?? '';
    this.user.id = localStorage.getItem('id') ?? '';
  }

  // Para recargar al iniciar la vista y al dar a un boton
  getListData(): void {
    this.listService.getMyLists().subscribe({
      next: (data) => {
        this.lists = data;
        this.loading = false;
        console.log(this.lists);
      },
      error: (error) => {
        this.error = error.error;
        this.loading = false;
      },
    });
  }

  viewDetailsList(id: number): void {
    console.log(id);
    // redirigir luego
  }

  // Para mostrar o ocultar formulario
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newListName = '';
    }
  }

  cancelAdd() {
    this.toggleAddForm();
  }

  createList(newNameList: string): void {
    this.listService.postList(newNameList).subscribe({
      next: (list) => {
        alert('Lista creada');
        // añadirla en el local para menos carga backend
        console.log(list)
        this.lists.push(list);
      },
      error: (error) => {
        console.log(error.error)
        alert('A ocurrido un error');
      },
    });
  }

  deleteList(id: number): void {
    const confirmed = confirm('¿Seguro que quieres borrar esta lista?');
    if (!confirmed) return;
    this.listService.deleteList(id).subscribe({
      next: (response) => {
        alert("Lista eliminada");
        // eliminar del local pa lo mismo
        this.lists = this.lists.filter(list => list.id !== id);
      },
      error: (error) => {
        console.log(error)
        alert("Ocurrio un error");
      },
    });
  }
}
