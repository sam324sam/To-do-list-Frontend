import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Url de la api
import { environment } from '../../environments/environment';
// model
import { User } from '../models/User/user.model';

// el backend se encarga de ver la sesion
@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly apiUrl = environment.apiUrl + '/lists';

  constructor(private readonly http: HttpClient) {}

  // Obtener mis listas
  getMyLists(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  // Crear listas
  postList(newNameList: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/create`,
      { name: newNameList },
      { withCredentials: true }
    );
  }

  // Eliminar listas
  deleteList(id: number): Observable<string> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { withCredentials: true });
  }

  // actualizar nombre de lista
  updateListName(id: number, newName: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/update/${id}`,
      { name: newName },
      { withCredentials: true }
    );
  }

  // Eliminar estar compartida
  deleteShareMe(listId: number): Observable<string> {
    return this.http.delete<any>(`${this.apiUrl}/share-me`, {
      body: listId,
      withCredentials: true,
    });
  }

  // Añadir alguin a una lista
  createShared(listId: number, userId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/share`,
      { listId, userId },
      { withCredentials: true }
    );
  }

  // eliminar
  deleteShared(listId: number, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/share`, {
      body: { listId, userId },
      withCredentials: true,
    });
  }

  // ver usuario con la tarea compartida
  getUserSharedList(listId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/share/${listId}`, {
      withCredentials: true,
    });
  }
}
