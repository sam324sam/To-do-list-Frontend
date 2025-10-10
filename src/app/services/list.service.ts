import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// el backend se encarga de ver la sesion
export class ListService {
  private readonly apiUrl = 'http://localhost:8080/api/lists';

  constructor(private readonly http: HttpClient) {}

  getMyLists(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true });
  }

  postList(newNameList: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/create`,
      { name: newNameList },
      { withCredentials: true }
    );
  }

  deleteList(id: number): Observable<string> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { withCredentials: true });
  }
}
