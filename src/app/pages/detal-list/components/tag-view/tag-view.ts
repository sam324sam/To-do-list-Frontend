import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
// modelo
import { Task } from '../../../../models/Task/task.model';
import { Tag } from '../../../../models/Tag/tag.model';
// Servicio
import { TagService } from '../../../../services/tag.service';
import { MesageService } from '../../../../services/mesage.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tag-view',
  imports: [FormsModule],
  templateUrl: './tag-view.html',
  styleUrl: './tag-view.css',
})
export class TagView implements OnChanges {
  @Input() tagView: boolean = false;
  @Input() taskTagsView: Task = {
    id: 0,
    title: '',
    description: '',
    status: '',
    tags: [],
    updatedAt: '',
    dueDate: '',
    userName: '',
  };
  @Output() togleTagView = new EventEmitter();
  @Output() reloadTask = new EventEmitter<number>();

  // Cargas de Tags de la tarea
  loadingTagsByTask: boolean = false;
  // Cargas de Tags del usuario
  tagsByUser: Tag[] = [];
  loadingTagsByUser: boolean = false;
  // cambio de vista para el formulario crear
  activeCreateForm: boolean = false;
  newTag: string = '';

  constructor(
    private readonly mesageService: MesageService,
    private readonly tagService: TagService
  ) {}
  // Quitar las vistas
  cancelTagView(): void {
    this.togleTagView.emit();
  }

  // Cuando existan nuevos datos del task llamar al backend
  ngOnChanges(changes: SimpleChanges): void {
    // Verificamos si cambió 'tagView' y está en true
    if (changes['tagView']?.currentValue === true && this.taskTagsView?.id > 0) {
      this.loadTagsFromBackend();
    }
  }

  async assignTag(tagId: number): Promise<void> {
    this.loadingTagsByTask = true;
    try {
      await firstValueFrom(this.tagService.assignTag(this.taskTagsView.id, tagId));
      this.mesageService.showMesage('Etiqueta vinculada', 'ok');
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.reloadTask.emit(this.taskTagsView.id);
      this.loadingTagsByTask = false;
    }
  }

  async unassignTag(tagId: number): Promise<void> {
    this.loadingTagsByTask = true;
    try {
      await firstValueFrom(this.tagService.unassignTag(this.taskTagsView.id, tagId));
      this.mesageService.showMesage('Etiqueta vinculada', 'ok');
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.reloadTask.emit(this.taskTagsView.id);
      this.loadingTagsByTask = false;
    }
  }

  // eliminar la tag
  async deleteTag(tagId: number): Promise<void> {
    this.loadingTagsByUser = true;
    try {
      await firstValueFrom(this.tagService.deleteTag(tagId));
      this.mesageService.showMesage('Etiqueta Eliminada', 'ok');
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.loadTagsFromBackend();
      this.loadingTagsByUser = false;
    }
  }

  // Cargar del servicio
  async loadTagsFromBackend() {
    this.loadingTagsByUser = true;
    try {
      this.tagsByUser = await firstValueFrom(this.tagService.getTagsByUser());
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.loadingTagsByUser = false;
    }
  }

  // Para el formulario de crear etiqueta
  togleFormCreateTag() {
    this.activeCreateForm = !this.activeCreateForm;
  }

  async createNewTag(newTag: string) {
    this.loadingTagsByUser = true;
    try {
      await firstValueFrom(this.tagService.createTag(newTag));
      this.loadTagsFromBackend();
      this.mesageService.showMesage('Etiqueta creada', 'ok');
    } catch (error) {
      this.mesageService.showMesage('Ha ocurrido un error', 'error');
      console.log(error);
    } finally {
      this.loadingTagsByUser = false;
      this.togleFormCreateTag();
    }
  }
}
