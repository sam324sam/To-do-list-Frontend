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
import { SharedList } from './components/shared-list/shared-list';
import { TagView } from './components/tag-view/tag-view';
// Modelos
import { CreateTask } from '../../models/Task/createTask.model';
import { Task } from '../../models/Task/task.model';
import { TaskUpdate } from '../../models/Task/taskUpdate.model';

@Component({
  selector: 'app-detal-list',
  imports: [FormsModule, ItemTask, AddTaskForm, SharedList, TagView],
  templateUrl: './detal-list.html',
  styleUrl: './detal-list.css',
})
export class DetalList implements OnInit {
  // De la lista
  listId: number = 0;
  listUsername: string = '';
  listName: string = '';

  taskList: Task[] = [];
  loadingTasks: boolean = false;
  // Para mostrar cargando al crear una nueva tarea
  loadingTaskPost: boolean = false;
  showAddForm: boolean = false;
  // Update de las task
  loadingEditing: boolean = false;
  selectIdList: number = 0;

  // Variables para las vistas de tags
  tagView: boolean = false;
  taskTagsView: Task = {
    id: 0,
    title: '',
    description: '',
    status: '',
    tags: [],
    updatedAt: '',
    dueDate: '',
    userName: '',
  };

  // Variables para el shared list component
  sharedList: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly mesageService: MesageService,
    private readonly taskService: TaskService
  ) {}

  ngOnInit() {
    // Obtener los datos de la lista desde el estado de navegación como un prop de vue
    this.listId = history.state['listId'];
    this.listName = history.state['listName'];
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
      this.mesageService.showMesage('Tarea creada con éxito', 'ok');
      // recarga desde el backend
      this.getTasks(this.listId);
      // cerrar el formulario
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.loadingTaskPost = false;
    }
  }

  // Editar una task
  async updateTask(editTaskId: number, editTask: TaskUpdate): Promise<void> {
    this.loadingEditing = true;
    this.selectIdList = editTaskId;
    try {
      await firstValueFrom(this.taskService.updateTask(editTask, editTaskId));
      this.mesageService.showMesage('Tarea editada con éxito', 'ok');
      // recarga desde el backend
      this.getTasks(this.listId);
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.loadingTaskPost = false;
      this.selectIdList = 0;
    }
  }

  // Para las vistas de crear tags
  startTagsView(taskTagsView: Task) {
    // tags de esas tareas para darle al componente
    this.taskTagsView = taskTagsView;
    this.togleTagView();
  }

  togleTagView() {
    this.tagView = !this.tagView;
  }
  // crear una tag

  // Para la vista de compartir
  togledSharedList(): void {
    this.sharedList = !this.sharedList;
  }

  // Esto recarga despues de assignar o designar una etiqueta en tagview
  async reloadTask(taskId: number): Promise<void> {
    try {
      const updatedTask = await firstValueFrom(this.taskService.getTaskById(taskId));
      // para la vista tag
      this.taskTagsView = updatedTask;
      // Actualiza el array de tareas (puede ser más eficiente que recargar lo demas)
      const index = this.taskList.findIndex((t) => t.id === taskId);
      if (index !== -1) {
        this.taskList[index] = updatedTask;
      }
    } catch (error) {
      console.error('Error al recargar la tarea:', error);
    }
  }
}
