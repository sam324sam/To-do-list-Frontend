import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Servicios
import { ListService } from '../../services/list.service';
import { MesageService } from '../../services/mesage.service';
// formularios
import { FormsModule } from '@angular/forms';
// Para las llamadas asincronas
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
// Componentes
import { ItemList } from './components/item-list/item-list';
import { AddListForm } from './components/add-list-form/add-list-form';

@Component({
  selector: 'app-all-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemList, AddListForm],
  templateUrl: './all-list.html',
  styleUrl: './all-list.css',
})
export class AllList implements OnInit {
  // Para guardar las listas
  lists: any[] = [];
  // Para el buscador
  filterLists: any[] = [];
  // Para mostrar una carga
  loadingListGet: boolean = true;
  loadingListPost: boolean = false;
  loadingListDelete: boolean = false;
  loadingListUpdate: boolean = false;
  selectIdList: number = 0;
  // para en caso de error
  error: string = '';
  // Para el formulario del add
  showAddForm: boolean = false;
  newListName: string = '';
  // Para el input editable
  isEditing: boolean = false;
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
  async getListData(): Promise<void> {
    this.loadingListGet = true;
    try {
      const data = await firstValueFrom(this.listService.getMyLists());
      this.lists = data;
      this.filterLists = data;
    } catch (error: any) {
      this.error = error.error || 'Error al obtener las listas';
      console.error(error);
    } finally {
      this.loadingListGet = false;
    }
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
      this.router.navigate(['/detal-list'], {
        state: { listId: selectedList.id, listUsername: selectedList.userName },
      });
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
  async createList(newNameList: string): Promise<void> {
    this.loadingListPost = true;
    try {
      await firstValueFrom(this.listService.postList(newNameList));
      this.mesageService.showMesage('Lista creada con éxito', 'ok');
      // recarga desde el backend
      this.getListData();
      // cerrar el formulario
      this.toggleAddForm();
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
      this.loadingListPost = false;
    } finally {
      this.loadingListPost = false;
    }
  }

  // Eliminar una lista
  async deleteList(id: number): Promise<void> {
    this.selectIdList = id;
    const confirmed = confirm('¿Seguro que quieres borrar esta lista?');
    if (!confirmed) return;

    this.loadingListDelete = true;

    try {
      await firstValueFrom(this.listService.deleteList(id));
      this.mesageService.showMesage('Lista eliminada', 'ok');

      // Eliminar del local
      this.lists = this.lists.filter((list) => list.id !== id);
      this.filterLists = this.filterLists.filter((list) => list.id !== id);
    } catch (error) {
      console.error(error);
      this.mesageService.showMesage('Ocurrió un error', 'error');
    } finally {
      this.loadingListDelete = false;
    }
  }

  // cambiar el nombre de las listas asincronicamente
  async changeListName(editListId: number, editListName: string): Promise<void> {
    this.selectIdList = editListId;
    // Por si llega el id null
    if (!editListId) {
      this.mesageService.showMesage('No hay lista seleccionada para editar.', 'error');
      return;
    }
    // Realizar la peticion
    try {
      this.loadingListUpdate = true;
      await firstValueFrom(this.listService.updateListName(editListId, editListName));

      this.mesageService.showMesage('Nombre de lista actualizado', 'ok');

      const index = this.lists.findIndex((list) => list.id === editListId);
      if (index !== -1) {
        this.lists[index].name = editListName;
        this.filterLists[index].name = editListName;
      }
    } catch (error) {
      console.error(error);
      this.mesageService.showMesage('Ocurrió un error', 'error');
    } finally {
      this.loadingListUpdate = false;
    }
  }

  async deleteShare(idList: number): Promise<void> {
    const confirmed = confirm('¿Seguro que quieres eliminar el acceso a esta lista?');
    if (!confirmed) return;

    try {
      this.loadingListDelete = true;
      await firstValueFrom(this.listService.deleteShare(idList));

      this.mesageService.showMesage('Acceso a la lista eliminado', 'ok');
      this.lists = this.lists.filter((list) => list.id !== idList);
      this.filterLists = this.filterLists.filter((list) => list.id !== idList);
    } catch (error) {
      console.error(error);
      this.mesageService.showMesage('Ocurrió un error', 'error');
    } finally {
      this.loadingListDelete = false;
    }
  }
}
