import { Component, EventEmitter, Input, Output } from '@angular/core';
// router
import { Router } from '@angular/router';
// formularios
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  imports: [FormsModule],
  templateUrl: './item-list.html',
  styleUrl: './item-list.css',
})
export class ItemList {
  // variables y metodos del padre
  // Luego cambiar por un modelo
  @Input() list: any;
  @Input() userName: string = '';
  @Input() loadingListDelete: boolean = false;
  @Input() loadingListUpdate: boolean = false;
  @Input() selectIdList: number = 0;
  // evento que avisa al padre como remoteevent
  @Output() deleteList = new EventEmitter<number>();
  @Output() changeListName = new EventEmitter<{ editListId: number; editListName: string }>();
  @Output() deleteShareList = new EventEmitter<number>();

  // Para el input editable
  isEditing: boolean = false;
  editListId: number | null = null;
  editListName: string = '';

  constructor(private readonly router: Router) {}

  // Navegar a la vista detalle
  viewDetailsList(): void {
    this.router.navigate(['/detal-list'], {
      state: { listId: this.list.id, listUsername: this.list.userName, listName: this.list.name },
    });
  }

  // Eliminar una lista
  buttonDeleteList(id: number): void {
    this.deleteList.emit(id);
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

  // Editar el nombre de la lista
  buttonChangeListName(editListName: string): void {
    this.loadingListUpdate = true;
    this.changeListName.emit({ editListId: this.editListId!, editListName: this.editListName });
    this.toggleEditForm();
  }

  buttonDeleteShare(idList: number): void {
    this.loadingListDelete = true;
    this.deleteShareList.emit(idList);
    this.loadingListDelete = false;
  }
}
