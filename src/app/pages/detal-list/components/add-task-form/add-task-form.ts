import { Component, EventEmitter, Input, Output } from '@angular/core';
// Modelos
import { CreateTask } from '../../../../models/createTask.model';
// Formularios reactivos
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task-form',
  imports: [FormsModule],
  templateUrl: './add-task-form.html',
  styleUrl: './add-task-form.css',
})
export class AddTaskForm {
  // Variables del padre
  @Input() 
  @Input() loadingTaskPost: boolean = false;
  // Metodos del padre
  @Output() createTask = new EventEmitter<CreateTask>();

  newTask: CreateTask = { title: '', description: '', dueDate: '', listId: 0 };
  showAddForm: boolean = false;
  // Crear una tarea
  buttonCreateTask(){
    this.createTask.emit(this.newTask)
    this.toggleAddForm();
  }

  // Formato de fecha
  formatDate(dateString: string | null): string {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  // Para mostrar o ocultar formulario
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }
}
