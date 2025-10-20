import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Mesage {
  text: string;
  type: 'ok' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class MesageService {
  private readonly mensajeSubject = new Subject<Mesage>();
  mensaje$ = this.mensajeSubject.asObservable();

  showMesage(text: string, type: 'ok' | 'error' | 'info' = 'info') {
    this.mensajeSubject.next({ text, type });
  }
}
