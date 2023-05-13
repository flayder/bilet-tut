import { Component, Input, OnInit } from '@angular/core';
import { IEventCheckerItem } from 'src/app/exports/interfaces/IEventCheckerItem';

@Component({
  selector: 'tr[data-app-statistic-checkin-item]',
  templateUrl: './statistic-checkin-item.component.html',
  styleUrls: ['./statistic-checkin-item.component.css']
})
export class StatisticCheckinItemComponent implements OnInit {

  @Input() item: IEventCheckerItem

  constructor() { }

  ngOnInit(): void {
  }

  getUserName() {
    let name = ''
    if(this.item.checker?.surname || this.item.checker?.username) {
      if(this.item.checker?.surname) {
        name += this.item.checker?.surname + ' '
      }

      if(this.item.checker?.username) {
        name += this.item.checker?.username
      }
    }

    return name
  }

}
