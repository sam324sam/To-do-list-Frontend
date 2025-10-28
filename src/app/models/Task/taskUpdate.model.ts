// Interfaz para cuando llega la data de las tareas y para actualizar datos de la misma
import { Tag } from '../Tag/tag.model';

export interface TaskUpdate {
  title: string;
  description: string;
  status: string;
  tags: Tag[];
  dueDate: string;
}
