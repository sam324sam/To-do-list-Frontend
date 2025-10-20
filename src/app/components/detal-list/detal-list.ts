import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detal-list',
  imports: [],
  templateUrl: './detal-list.html',
  styleUrl: './detal-list.css',
})
export class DetalList implements OnInit {
  list: any;

  constructor(private readonly router: Router) {}

  ngOnInit() {
    // Obtener los datos de la lista desde el estado de navegación como un prop de vue
    this.list = history.state['list'];

    if (!this.list) {
      console.log('No hay datos');
      this.router.navigate(['/']);
    }
  }
  // Regresar a las vistas de todas las listas
  goBack() {
    this.router.navigate(['/all-list']);
  }

  
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
}
