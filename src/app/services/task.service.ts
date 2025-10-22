import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// URL
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = environment.apiUrl + '/task';

  constructor(private readonly http: HttpClient) {}

  // Crear tarea
  postTask(newTask: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/create/ ${newTask.listId}`,
      newTask,
      { withCredentials: true }
    );
  }

  // Para crear tareas compartidas
  getTasks(idList: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/list/${idList}`,
      { withCredentials: true }
    );
  }
}
