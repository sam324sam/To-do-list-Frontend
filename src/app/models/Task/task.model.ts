// Interfaz para cuando llega la data de las tareas y para actualizar datos de la misma
import { Tag } from '../Tag/tag.model';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  tags: Tag[];
  updatedAt: string;
  dueDate: string;
  userName: string;
}
