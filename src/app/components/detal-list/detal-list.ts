import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Formularios reactivos
import { FormsModule } from '@angular/forms';
// Servicios
import { MesageService } from '../../services/mesage.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-detal-list',
  imports: [FormsModule],
  templateUrl: './detal-list.html',
  styleUrl: './detal-list.css',
})
export class DetalList implements OnInit {
  list: any;
  listId: number = 0;
  loadingTasks: boolean = false;
  // Para mostrar cargando al crear una nueva tarea
  loadingTaskPost: boolean = false;
  showAddForm: boolean = false;
  newTask: any = { title: '', description: '', dueDate: null , listId: 0 };

  constructor(
    private readonly router: Router,
    private readonly mesageService: MesageService,
    private readonly taskService: TaskService
  ) {}

  ngOnInit() {
    // Obtener los datos de la lista desde el estado de navegación como un prop de vue
    this.list = history.state['list'];

    if (!this.list) {
      console.log('No hay datos');
      this.router.navigate(['/']);
    }
    this.listId = this.list.id;
  }
  // Regresar a las vistas de todas las listas
  goBack() {
    this.router.navigate(['/all-list']);
  }

  // Recargar las tareas de la lista
  getTasks(idList: number): void {
    this.loadingTasks = true;
    this.taskService.getTasks(idList).subscribe({
      next: (response) => {
        this.list.tasks = response.tasks;
        this.loadingTasks = false;
      },
      error: (error) => {
        this.mesageService.showMesage('Ha ocurrido un error', 'error');
        console.log(error.error);
        this.loadingTasks = false;
      },
    });
  }

  // Cambiar luego
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'Pendiente',
      COMPLETED: 'Completada',
      IN_PROGRESS: 'En Progreso',
    };
    return statusMap[status] || status;
  }

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

  // Crear una nueva lista
  createTask(): void {
    this.loadingTaskPost = true;
    // Asignar el id de la lista a la nueva tarea y la fecha
    this.newTask.listId = this.listId;
    this.taskService.postTask(this.newTask).subscribe({
      next: () => {
        this.mesageService.showMesage('Lista creada con éxito', 'ok');
        // recarga desde el backend
        this.getTasks(this.listId);
        this.loadingTaskPost = false;
        // cerrar el formulario
        this.toggleAddForm();
      },
      error: (error) => {
        this.mesageService.showMesage('Ha ocurrido un error', 'error');
        console.log(error.error);
        this.loadingTaskPost = false;
      },
    });
  }
}
