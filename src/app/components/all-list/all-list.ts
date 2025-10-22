import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Servicios
import { ListService } from '../../services/list.service';
import { MesageService } from '../../services/mesage.service';
// formularios
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  // Para el buscador
  filterLists: any[] = [];
  // Para mostrar un login despues
  loadingListGet: boolean = true;
  loadingListPost: boolean = false;
  loadingListDelete: boolean = false;
  loadingListUpdate: boolean = false;
  // para en caso de error
  error: string = '';
  // Para el formulario del add
  showAddForm: boolean = false;
  newListName: string = '';
  // Para el input editable
  isEditing: boolean = false;
  editListId: number | null = null;
  editListName: string = '';
  // Usuario de sesion
  user = {
    userName: '',
    id: '',
  };

  constructor(
    private readonly listService: ListService,
    private readonly router: Router,
    private readonly mesageService: MesageService
  ) {}

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
        this.filterLists = data;
        this.loadingListGet = false;
        console.log(this.lists);
      },
      error: (error) => {
        this.error = error.error;
        this.loadingListGet = false;
      },
    });
  }

  // Filtrar las listas
  filter(searchTerm: string): void {
    const lowerSearchTerm = searchTerm.toLowerCase();
    this.filterLists = this.lists.filter((list) =>
      list.name.toLowerCase().includes(lowerSearchTerm)
    );
  }

  // Navegar a la vista detalle
  viewDetailsList(id: number): void {
    const selectedList = this.lists.find((list) => list.id === id);
    if (selectedList) {
      this.router.navigate(['/detal-list'], { state: { list: selectedList } });
    }
  }

  // Para mostrar o ocultar formulario
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newListName = '';
    }
  }

  // Crear una nueva lista
  createList(newNameList: string): void {
    this.loadingListPost = true;
    this.listService.postList(newNameList).subscribe({
      next: () => {
        this.mesageService.showMesage('Lista creada con éxito', 'ok');
        // recarga desde el backend
        this.getListData();
        this.loadingListPost = false;
        // cerrar el formulario
        this.toggleAddForm();
      },
      error: (error) => {
        this.mesageService.showMesage('Ha ocurrido un error', 'error');
        console.log(error.error);
        this.loadingListPost = false;
      },
    });
  }

  // Eliminar una lista
  deleteList(id: number): void {
    const confirmed = confirm('¿Seguro que quieres borrar esta lista?');
    if (!confirmed) return;
    this.loadingListDelete = true;
    this.listService.deleteList(id).subscribe({
      next: (response) => {
        this.mesageService.showMesage('Lista eliminada', 'ok');
        // eliminar del local pa lo mismo
        this.lists = this.lists.filter((list) => list.id !== id);
        this.filterLists = this.filterLists.filter((list) => list.id !== id);
        this.loadingListDelete = false;
      },
      error: (error) => {
        console.log(error);
        this.mesageService.showMesage('Ocurrio un error', 'error');
        this.loadingListDelete = false;
      },
    });
  }

  toggleEditForm(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.editListId = null;
      this.editListName = '';
    }
  }

  startEditing(id: number, currentName: string): void {
    this.editListId = id;
    this.editListName = currentName;
    this.isEditing = true;
  }

  changeListName(editListName: string): void {
    if (this.editListId === null) {
      this.mesageService.showMesage('No hay lista seleccionada para editar.', 'error');
      return;
    }
    const id = this.editListId;
    this.loadingListUpdate = true;
    this.listService.updateListName(id, editListName).subscribe({
      next: () => {
        this.mesageService.showMesage('Nombre de lista actualizado', 'ok');
        // actualizar en el local para menos carga
        const index = this.lists.findIndex((list) => list.id === id);
        if (index !== -1) {
          this.lists[index].name = editListName;
          this.filterLists[index].name = editListName;
          this.toggleEditForm();
        }
        this.loadingListUpdate = false;
      },
      error: (error) => {
        console.log(error);
        this.mesageService.showMesage('Ocurrio un error', 'error');
        this.loadingListUpdate = false;
      },
    });
  }

  deleteShare(idList: number): void {
    const confirmed = confirm('¿Seguro que quieres eliminar el acceso a esta lista?');
    if (!confirmed) return;
    this.loadingListDelete = true;
    this.listService.deleteShare(idList).subscribe({
      next: (response) => {
        this.mesageService.showMesage('Acceso a la lista eliminado', 'ok');
        // eliminar del local pa lo mismo
        this.lists = this.lists.filter((list) => list.id !== idList);
        this.filterLists = this.filterLists.filter((list) => list.id !== idList);
        this.loadingListDelete = false;
      },
      error: (error) => {
        console.log(error);
        this.mesageService.showMesage('Ocurrio un error', 'error');
        this.loadingListDelete = false;
      },
    });
  }
}
