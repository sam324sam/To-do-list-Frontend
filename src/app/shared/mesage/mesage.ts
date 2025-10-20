import { Component, OnInit } from '@angular/core';
import { MesageService } from '../../services/mesage.service';

@Component({
  selector: 'app-mesage',
  imports: [],
  templateUrl: './mesage.html',
  styleUrl: './mesage.css'
})

export class Mesage implements OnInit {
  text = '';
  type: 'ok' | 'error' | 'info' = 'info';
  visible = false;

  constructor(private readonly mesageService: MesageService) {}

  ngOnInit() {
    this.mesageService.mensaje$.subscribe((msg) => {
      this.text = msg.text;
      this.type = msg.type;
      this.visible = true;
      setTimeout(() => this.visible = false, 3000);
    });
  }
}
