import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EVENT_CITY, EVENT_DATA, EVENT_SUBJECT } from 'src/app/exports/constans';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { SetEventLocalStorageData } from 'src/app/exports/functions/SetEventLocalStorageData';
import { IEventArea } from 'src/app/exports/interfaces/IEventArea';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: '[data-app-schem-area]',
  templateUrl: './schem-area.component.html',
  styleUrls: ['./schem-area.component.css']
})
export class SchemAreaComponent implements AfterContentInit {
  
  item: IEventArea
  @Input() isArea: number = 0
  @Output() data = new EventEmitter
  items: ISelectValue[] = []
  value = 0

  constructor(
    private event$: EventService
  ) {
    EVENT_CITY.subscribe((id: any) => {
      if(id > 0) {
        this.isArea = id
        this.init()
      }
    })
  }

  ngAfterContentInit(): void {
    if(this.isArea > 0) {
      this.init()
    }
  }

  init() {
    this.event$.getAreaDetail(this.isArea).subscribe((response: IHttpResponse) => {
      if(response.results) {
        this.item = response.results
      }
    })
  }

}
