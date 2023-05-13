import { Component, Input, OnInit } from '@angular/core';
import { SHORT_MONTHS } from 'src/app/exports/constans';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';

@Component({
  selector: 'div[data-app-event-block]',
  templateUrl: './event-block.component.html',
  styleUrls: ['./event-block.component.css']
})
export class EventBlockComponent implements OnInit {

  @Input() item: IEventItem

  constructor() { }

  ngOnInit(): void {
  }

  getMonth(num: any) {
    return SHORT_MONTHS[num - 1]
  }

}
