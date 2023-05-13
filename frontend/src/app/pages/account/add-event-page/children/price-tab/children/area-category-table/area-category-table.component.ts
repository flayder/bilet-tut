import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEventAreaCategory } from 'src/app/exports/interfaces/IEventAreaCategory';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: '[data-app-area-category-table]',
  templateUrl: './area-category-table.component.html',
  styleUrls: ['./area-category-table.component.css']
})
export class AreaCategoryTableComponent implements OnInit {
  
  items: Array<IEventAreaCategory> = []
  event: any = false
  @Output() data = new EventEmitter

  constructor(
    private event$: EventService,
    private param$: ActivatedRoute
  ) { 
    this.param$.params.subscribe(params => {
      if(typeof params == "object" && params.event_id > 0) {
        this.event = params.event_id
      }
    })

    this.event$.areaCategories.subscribe(items => {
      if(Array.isArray(items)) {
        this.data.emit(items)
        this.items = items
      }
    })
  }

  ngOnInit(): void {
    this.event$.getAreaCategories({event__pk: this.event})
  }

}
