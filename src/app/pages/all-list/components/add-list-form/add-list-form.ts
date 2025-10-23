import { Component, EventEmitter, Input, Output } from '@angular/core';
// formularios
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-list-form',
  imports: [FormsModule],
  templateUrl: './add-list-form.html',
  styleUrl: './add-list-form.css',
})
export class AddListForm {
  // variables del padre
  @Input() loadingListPost: boolean = false;
  // Remoteevents
  @Output() createList = new EventEmitter<string>();

  showAddForm: boolean = false;
  newListName: string = '';

  // Para mostrar o ocultar formulario
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newListName = '';
    }
  }

  buttonCreateList(newListName: string) {
    this.createList.emit(newListName);
  }
}
