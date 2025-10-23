import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-task',
  imports: [],
  templateUrl: './item-task.html',
  styleUrl: './item-task.css',
})
export class ItemTask {
  @Input() task: any;

  // Cambiar luego
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'Pendiente',
      COMPLETED: 'Completada',
      IN_PROGRESS: 'En Progreso',
    };
    return statusMap[status] || status;
  }

  // Para la fecha bonita :)
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
