import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEventPrice } from 'src/app/exports/interfaces/IEventPrice';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: '[data-app-price-table]',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.css']
})
export class PriceTableComponent implements OnInit {
  
  items: Array<IEventPrice> = []
  @Output() data = new EventEmitter
  event: any = false

  constructor(
    private event$: EventService,
    private param$: ActivatedRoute
  ) { 
    this.param$.params.subscribe(params => {
      if(typeof params == "object" && params.event_id > 0) {
        this.event = params.event_id
      }
    })

    this.event$.prices.subscribe(items => {
      if(Array.isArray(items)) {
        this.data.emit(items)
        this.items = items
      }
    })
  }

  ngOnInit(): void {
    this.event$.getPrice({event__pk: this.event})
  }

}
