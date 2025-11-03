import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-list',
  imports: [],
  templateUrl: './shared-list.html',
  styleUrl: './shared-list.css'
})
export class SharedList {
 @Input() sharedList: boolean = false;
 @Output() togledSharedList = new EventEmitter();

 cancelShared(): void {
  this.togledSharedList.emit();
 }
}
