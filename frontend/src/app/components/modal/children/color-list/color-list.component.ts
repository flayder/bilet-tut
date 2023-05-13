import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: '[data-app-color-list]',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.css']
})
export class ColorListComponent implements OnInit {

  colors = [
    '#F93C00',
    '#FAAD14',
    '#00BA34',
    '#1890FF',
    '#13C2C2',
    '#EB2F96',
    '#722ED1',
  ]


  @Input() color: string = ""
  @Output() data = new EventEmitter()

  setColor(color: any) {
    this.color = color
    this.data.emit(color)
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
