import { Component, OnInit, Input } from '@angular/core';
import { IEventItem } from '../../../../../exports/interfaces/IEventItem';

@Component({
  selector: '[data-app-wrap-statistic-page]',
  templateUrl: './wrap-statistic-page.component.html',
  styleUrls: ['./wrap-statistic-page.component.css']
})
export class WrapStatisticPageComponent implements OnInit {

  //@Input() items: IEventItem[] = []
  type: string = 'items'
  
  constructor() { }

  setType(type: string) {
    this.type = type
  }

  ngOnInit(): void {
  }

}
