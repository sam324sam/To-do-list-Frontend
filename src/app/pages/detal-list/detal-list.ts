import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Formularios reactivos
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
// Servicios
import { MesageService } from '../../services/mesage.service';
import { TaskService } from '../../services/task.service';
// Componentes
import { ItemTask } from './components/item-task/item-task';
import { AddTaskForm } from './components/add-task-form/add-task-form';
// Modelos
import { CreateTask } from '../../models/createTask.model';

@Component({
  selector: 'app-detal-list',
  imports: [FormsModule, ItemTask, AddTaskForm],
  templateUrl: './detal-list.html',
  styleUrl: './detal-list.css',
})
export class DetalList implements OnInit {
  listId: number = 0;
  listUsername: string = '';
  taskList: any[] = [];
  loadingTasks: boolean = false;
  // Para mostrar cargando al crear una nueva tarea
  loadingTaskPost: boolean = false;
  showAddForm: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly mesageService: MesageService,
    private readonly taskService: TaskService
  ) {}

  ngOnInit() {
    // Obtener los datos de la lista desde el estado de navegación como un prop de vue
    this.listId = history.state['listId'];
    this.listUsername = history.state['listUsername'];
    if (!this.listId) {
      console.log('No hay datos');
      this.router.navigate(['/']);
    }
    this.getTasks(this.listId);
  }

  // Regresar a las vistas de todas las listas
  goBack() {
    this.router.navigate(['/all-list']);
  }

  // Recargar las tareas de la lista
  async getTasks(idList: number): Promise<void> {
    this.loadingTasks = true;
    try {
      this.taskList = await firstValueFrom(this.taskService.getTasks(idList));
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.loadingTasks = false;
    }
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

  // Crear una nueva lista
  async createTask(newTask: CreateTask): Promise<void> {
    this.loadingTaskPost = true;
    try {
      // Asignar el id de la lista a la nueva tarea y la fecha
      newTask.listId = this.listId;
      await firstValueFrom(this.taskService.postTask(newTask));
      this.mesageService.showMesage('Lista creada con éxito', 'ok');
      // recarga desde el backend
      this.getTasks(this.listId);
      this.loadingTaskPost = false;
      // cerrar el formulario
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.loadingTaskPost = false;
    }
  }
}
