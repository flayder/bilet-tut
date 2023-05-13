import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { BaoService } from 'src/app/services/bao.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-discount-table]',
  templateUrl: './discount-table.component.html',
  styleUrls: ['./discount-table.component.css']
})
export class DiscountTableComponent implements OnInit {
  
  items: Array<IDiscountItem> = []
  @Output() data = new EventEmitter
  event: any = false

  constructor(
    private bao$: BaoService,
    private user$: UserService,
    private param$: ActivatedRoute
  ) { 
    this.user$.user.subscribe(user => {
      if(
        typeof user == "object"
      ) {
        this.bao$.getDiscounts({event__pk: this.event, user: user.id})
      }
    })

    this.param$.params.subscribe(params => {
      if(typeof params == "object" && params.event_id > 0) {
        this.event = params.event_id
      }
    })
    this.bao$.discounts.subscribe(items => {
      if(Array.isArray(items)) {
        this.data.emit(items)
        this.items = items
      }
    })
  }

  ngOnInit(): void {
    
  }

}
