import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// URL
import { environment } from '../../environments/environment';
// Modelo
import { Tag } from '../models/Tag/tag.model';
import { TaskUpdate } from '../models/Task/taskUpdate.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly apiUrl = environment.apiUrl + '/tag';

  constructor(private readonly http: HttpClient) {}

  // Para crear tareas compartidas
  getTagsByUser(): Observable<Tag[]> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  // Actualizar los campos de la tarea
  updateTag(editTask: TaskUpdate) {
    return this.http.put<any>(
      `${this.apiUrl}/update`,
      editTask, // cuerpo de la petición
      { withCredentials: true }
    );
  }
  // Crear tarea
  postTags(newTask: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create/ ${newTask.listId}`, newTask, {
      withCredentials: true,
    });
  }

  // Asignar Tag
  assignTag(taskId: number, tagId: number) {
    return this.http.post<any>(
      `${this.apiUrl}/assign/${taskId}/${tagId}`,
      {},
      { withCredentials: true }
    );
  }

  //Eliminar tag
  deleteTag(tagId: number){
    return this.http.delete<any>(
      `${this.apiUrl}/delete/${tagId}`,
      { withCredentials: true }
    );
  }

  unassignTag(taskId: number, tagId: number){
    return this.http.post<any>(
      `${this.apiUrl}/unassign/${taskId}/${tagId}`,
      {},
      { withCredentials: true }
    );
  }

  // Crear tag
  createTag(newTag: string){
    return this.http.post<any>(
      `${this.apiUrl}/create`,
      {name: newTag},
      { withCredentials: true }
    );
  }
}
