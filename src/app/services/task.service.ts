import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// URL
import { environment } from '../../environments/environment';
// Modelo
import { Task } from '../models/Task/task.model';
import { TaskUpdate } from '../models/Task/taskUpdate.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = environment.apiUrl + '/task';

  constructor(private readonly http: HttpClient) {}

  // Crear tarea
  postTask(newTask: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/ ${newTask.listId}`, newTask, {
      withCredentials: true,
    });
  }

  // Para crear tareas compartidas
  getTasks(idList: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list/${idList}`, { withCredentials: true });
  }

  // Actualizar los campos de la tarea
  updateTask(editTask: TaskUpdate, editTaskId: number) {
    return this.http.put<any>(
      `${this.apiUrl}/update/${editTaskId}`,
      editTask, // cuerpo de la petición
      { withCredentials: true }
    );
  }
}
