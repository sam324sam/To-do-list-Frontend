import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
// Formularios
import { FormsModule } from '@angular/forms';
// modelos
import { Task } from '../../../../models/Task/task.model';
import { TaskUpdate } from '../../../../models/Task/taskUpdate.model';

@Component({
  selector: 'app-item-task',
  imports: [FormsModule],
  templateUrl: './item-task.html',
  styleUrl: './item-task.css',
})
export class ItemTask implements OnChanges {
  @Input() task: Task = {
    id: 0,
    title: '',
    description: '',
    status: '',
    tags: [],
    updatedAt: '',
    dueDate: '',
    userName: '',
  };
  @Input() loadingEditing: boolean = false;
  @Input() selectIdList: number = 0;
  @Output() updateTask = new EventEmitter<{ editTaskId: number; editTask: TaskUpdate }>();

  // Objeto para mandar al backend
  editTask: TaskUpdate = {
    title: '',
    description: '',
    status: '',
    tags: [],
    dueDate: '',
  };

  isEditing: boolean = false;
  // Para modifiacar los status
  status = [
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'En progreso', value: 'IN_PROGRESS' },
    { label: 'Completada', value: 'DONE' },
  ];

  // Cuando cambie el input task, copiamos sus datos a editTask
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.editTask = {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        tags: [...this.task.tags],
        dueDate: this.task.dueDate,
      };
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'Pendiente',
      DONE: 'Completada',
      IN_PROGRESS: 'En Progreso',
    };
    return statusMap[status] || status;
  }

  // Para la fecha bonita :)
  formatDate(dateString: string | null): string {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  // Abrir el form de editar
  toggleEditForm(): void {
    this.isEditing = !this.isEditing;
  }

  // Llamar al padre y actualizar el nombre
  buttonChangeTaskName() {
    this.loadingEditing = true;
    this.updateTask.emit({ editTaskId: this.task.id, editTask: this.editTask });
    this.loadingEditing = false;
    this.toggleEditForm();
  }
}
